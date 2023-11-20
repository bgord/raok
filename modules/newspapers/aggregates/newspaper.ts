import * as bg from "@bgord/node";

import * as Files from "../../files";

import * as Events from "../events";
import * as VO from "../value-objects";
import * as Services from "../services";
import * as Policies from "../policies";
import * as infra from "../../../infra";

import { Article } from "./article";

export class Newspaper {
  id: VO.NewspaperType["id"];

  stream: bg.EventType["stream"];

  status: VO.NewspaperType["status"] = VO.NewspaperStatusEnum.undetermined;

  articles: VO.NewspaperType["articles"] = [];

  scheduledAt: VO.NewspaperType["scheduledAt"] = 0;

  sentAt: VO.NewspaperType["sentAt"] = null;

  revision: bg.Schema.RevisionType = bg.Revision.initial;

  static MAX_ARTICLES_NUMBER = VO.NEWSPAPER_MAX_ARTICLES_NUMBER;

  constructor(id: VO.NewspaperType["id"]) {
    this.id = id;
    this.stream = Newspaper.getStream(id);
  }

  async build() {
    const events = await infra.EventStore.find(
      [
        Events.NewspaperScheduledEvent,
        Events.NewspaperGenerateEvent,
        Events.NewspaperSentEvent,
        Events.NewspaperArchivedEvent,
        Events.NewspaperFailedEvent,
      ],
      Newspaper.getStream(this.id)
    );

    for (const event of events) {
      switch (event.name) {
        case Events.NEWSPAPER_SCHEDULED_EVENT:
          this.articles = event.payload.articles;
          this.scheduledAt = event.payload.createdAt;
          this.status = VO.NewspaperStatusEnum.scheduled;
          this.revision = event.payload.revision;
          break;

        case Events.NEWSPAPER_GENERATED_EVENT:
          this.status = VO.NewspaperStatusEnum.ready_to_send;
          this.revision = event.payload.revision;
          break;

        case Events.NEWSPAPER_SENT_EVENT:
          this.status = VO.NewspaperStatusEnum.delivered;
          this.sentAt = event.payload.sentAt;
          this.revision = event.payload.revision;
          break;

        case Events.NEWSPAPER_ARCHIVED_EVENT:
          this.status = VO.NewspaperStatusEnum.archived;
          this.revision = event.payload.revision;
          break;

        case Events.NEWSPAPER_FAILED_EVENT:
          this.status = VO.NewspaperStatusEnum.error;
          this.revision = event.payload.revision;
          break;

        default:
          continue;
      }
    }

    return this;
  }

  static async schedule(articles: Article[]) {
    await Policies.NewspaperStatusTransition.perform({
      from: VO.NewspaperStatusEnum.undetermined,
      to: VO.NewspaperStatusEnum.scheduled,
    });

    await Policies.NoEmptyNewspaper.perform({ articles });

    await Policies.MaximumNewspaperArticleNumber.perform({
      articles,
      max: Newspaper.MAX_ARTICLES_NUMBER,
    });

    await Policies.ArticlesAreSendable.perform({ articles });

    const newspaperId = VO.NewspaperId.parse(bg.NewUUID.generate());

    await infra.EventStore.save(
      Events.NewspaperScheduledEvent.parse({
        name: Events.NEWSPAPER_SCHEDULED_EVENT,
        stream: Newspaper.getStream(newspaperId),
        version: 1,
        payload: {
          id: newspaperId,
          articles: articles.map((x) => x.entity),
          createdAt: Date.now(),
          revision: bg.Revision.initial,
        },
      } satisfies Events.NewspaperScheduledEventType)
    );
  }

  async generate(revision: bg.Revision) {
    revision.validate(this.revision);
    await Policies.NewspaperStatusTransition.perform({
      from: this.status,
      to: VO.NewspaperStatusEnum.ready_to_send,
    });

    try {
      await new Services.NewspaperFile({
        newspaperId: this.id,
        articles: this.articles,
      }).create();

      await infra.EventStore.save(
        Events.NewspaperGenerateEvent.parse({
          name: Events.NEWSPAPER_GENERATED_EVENT,
          stream: this.stream,
          version: 1,
          payload: { newspaperId: this.id, revision: revision.next().value },
        } satisfies Events.NewspaperGenerateEventType)
      );
    } catch (error) {
      infra.logger.error({
        message: "Newspaper generate error",
        operation: "newspaper_error",
        metadata: infra.logger.formatError(error),
      });

      await infra.EventStore.save(
        Events.NewspaperFailedEvent.parse({
          name: Events.NEWSPAPER_FAILED_EVENT,
          version: 1,
          stream: this.stream,
          payload: { newspaperId: this.id, revision: revision.next().value },
        } satisfies Events.NewspaperFailedEventType)
      );
    }
  }

  async send(revision: bg.Revision) {
    revision.validate(this.revision);
    await Policies.NewspaperStatusTransition.perform({
      from: this.status,
      to: VO.NewspaperStatusEnum.delivered,
    });

    try {
      await Files.Services.ArbitraryFileSender.send(
        Services.NewspaperFile.getAttachment(this.id)
      );

      await infra.EventStore.save(
        Events.NewspaperSentEvent.parse({
          name: Events.NEWSPAPER_SENT_EVENT,
          stream: this.stream,
          version: 1,
          payload: {
            newspaperId: this.id,
            articles: this.articles,
            sentAt: Date.now(),
            revision: revision.next().value,
          },
        } satisfies Events.NewspaperSentEventType)
      );
    } catch (error) {
      infra.logger.error({
        message: "Newspaper send error",
        operation: "newspaper_error",
        metadata: infra.logger.formatError(error),
      });

      await infra.EventStore.save(
        Events.NewspaperFailedEvent.parse({
          name: Events.NEWSPAPER_FAILED_EVENT,
          version: 1,
          stream: this.stream,
          payload: { newspaperId: this.id, revision: revision.next().value },
        } satisfies Events.NewspaperFailedEventType)
      );
    }
  }

  async archive(revision: bg.Revision) {
    revision.validate(this.revision);
    await Policies.NewspaperStatusTransition.perform({
      from: this.status,
      to: VO.NewspaperStatusEnum.archived,
    });

    await infra.EventStore.save(
      Events.NewspaperArchivedEvent.parse({
        name: Events.NEWSPAPER_ARCHIVED_EVENT,
        version: 1,
        stream: this.stream,
        payload: { newspaperId: this.id, revision: revision.next().value },
      } satisfies Events.NewspaperArchivedEventType)
    );
  }

  async cancel(revision: bg.Revision) {
    revision.validate(this.revision);
    if (
      (await Policies.HasNewspaperStalled.fails({
        status: this.status,
        scheduledAt: this.scheduledAt,
      })) &&
      (await Policies.NewspaperStatusTransition.fails({
        from: this.status,
        to: VO.NewspaperStatusEnum.archived,
      }))
    ) {
      return;
    }

    await infra.EventStore.save(
      Events.NewspaperArchivedEvent.parse({
        name: Events.NEWSPAPER_ARCHIVED_EVENT,
        version: 1,
        stream: this.stream,
        payload: { newspaperId: this.id, revision: revision.next().value },
      } satisfies Events.NewspaperArchivedEventType)
    );
  }

  async resend(revision: bg.Revision) {
    revision.validate(this.revision);
    await Policies.NewspaperStatusTransition.perform({
      from: this.status,
      to: VO.NewspaperStatusEnum.scheduled,
    });

    await infra.EventStore.save(
      Events.NewspaperScheduledEvent.parse({
        name: Events.NEWSPAPER_SCHEDULED_EVENT,
        version: 1,
        stream: this.stream,
        payload: {
          id: this.id,
          articles: this.articles,
          createdAt: Date.now(),
          revision: revision.next().value,
        },
      } satisfies Events.NewspaperScheduledEventType)
    );
  }

  static getStream(id: VO.NewspaperIdType) {
    return `newspaper_${id}`;
  }
}
