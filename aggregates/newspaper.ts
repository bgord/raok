import { UUID } from "@bgord/node";

import * as Events from "../events";
import * as VO from "../value-objects";
import * as Services from "../services";
import * as Policies from "../policies";

import { Article } from "./article";
import { EventRepository } from "../repositories/event-repository";

export class Newspaper {
  id: VO.NewspaperType["id"];

  stream: Events.StreamType;

  status: VO.NewspaperType["status"] = VO.NewspaperStatusEnum.undetermined;

  articles: VO.NewspaperType["articles"] = [];

  scheduledAt: VO.NewspaperType["scheduledAt"] = 0;

  sentAt: VO.NewspaperType["sentAt"] = null;

  static MAX_NUMBER_OF_ARTICLES = 10;

  constructor(id: VO.NewspaperType["id"]) {
    this.id = id;
    this.stream = Newspaper.getStream(id);
  }

  async build() {
    const events = await EventRepository.find(
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
          break;

        case Events.NEWSPAPER_GENERATED_EVENT:
          this.status = VO.NewspaperStatusEnum.ready_to_send;
          break;

        case Events.NEWSPAPER_SENT_EVENT:
          this.status = VO.NewspaperStatusEnum.delivered;
          this.sentAt = event.payload.sentAt;
          break;

        case Events.NEWSPAPER_ARCHIVED_EVENT:
          this.status = VO.NewspaperStatusEnum.archived;
          break;

        case Events.NEWSPAPER_FAILED_EVENT:
          this.status = VO.NewspaperStatusEnum.error;
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
      max: Newspaper.MAX_NUMBER_OF_ARTICLES,
    });

    await Policies.ArticlesAreSendable.perform({ articles });

    const newspaperId = VO.NewspaperId.parse(UUID.generate());

    await EventRepository.save(
      Events.NewspaperScheduledEvent.parse({
        name: Events.NEWSPAPER_SCHEDULED_EVENT,
        stream: Newspaper.getStream(newspaperId),
        version: 1,
        payload: {
          id: newspaperId,
          articles: articles.map((x) => x.entity),
        },
      })
    );
  }

  async generate() {
    await Policies.NewspaperStatusTransition.perform({
      from: this.status,
      to: VO.NewspaperStatusEnum.ready_to_send,
    });

    try {
      await new Services.NewspaperFile({
        newspaperId: this.id,
        articles: this.articles,
      }).create();

      await EventRepository.save(
        Events.NewspaperGenerateEvent.parse({
          name: Events.NEWSPAPER_GENERATED_EVENT,
          stream: this.stream,
          version: 1,
          payload: { newspaperId: this.id },
        })
      );
    } catch (error) {
      await EventRepository.save(
        Events.NewspaperFailedEvent.parse({
          name: Events.NEWSPAPER_FAILED_EVENT,
          version: 1,
          stream: this.stream,
          payload: { newspaperId: this.id },
        })
      );
    }
  }

  async send() {
    await Policies.NewspaperStatusTransition.perform({
      from: this.status,
      to: VO.NewspaperStatusEnum.delivered,
    });

    try {
      await Services.NewspaperSender.send(this.id);

      await EventRepository.save(
        Events.NewspaperSentEvent.parse({
          name: Events.NEWSPAPER_SENT_EVENT,
          stream: this.stream,
          version: 1,
          payload: {
            newspaperId: this.id,
            articles: this.articles,
            sentAt: Date.now(),
          },
        })
      );
    } catch (error) {
      await EventRepository.save(
        Events.NewspaperFailedEvent.parse({
          name: Events.NEWSPAPER_FAILED_EVENT,
          version: 1,
          stream: this.stream,
          payload: { newspaperId: this.id },
        })
      );
    }
  }

  async archive() {
    await Policies.NewspaperStatusTransition.perform({
      from: this.status,
      to: VO.NewspaperStatusEnum.archived,
    });

    await EventRepository.save(
      Events.NewspaperArchivedEvent.parse({
        name: Events.NEWSPAPER_ARCHIVED_EVENT,
        version: 1,
        stream: this.stream,
        payload: { newspaperId: this.id },
      })
    );
  }

  async resend() {
    await Policies.NewspaperStatusTransition.perform({
      from: this.status,
      to: VO.NewspaperStatusEnum.scheduled,
    });

    await EventRepository.save(
      Events.NewspaperScheduledEvent.parse({
        name: Events.NEWSPAPER_SCHEDULED_EVENT,
        version: 1,
        stream: this.stream,
        payload: { id: this.id, articles: this.articles },
      })
    );
  }

  static getStream(id: VO.NewspaperIdType) {
    return `newspaper_${id}`;
  }
}
