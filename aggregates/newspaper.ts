import { UUID } from "@bgord/node";

import * as Events from "../events";
import * as VO from "../value-objects";
import * as Services from "../services";
import * as Policies from "../policies";

import { EventRepository } from "../repositories/event-repository";

export class Newspaper {
  id: VO.NewspaperType["id"];
  status: VO.NewspaperType["status"] = VO.NewspaperStatusEnum.undetermined;
  articles: VO.NewspaperType["articles"] = [];
  scheduledAt: VO.NewspaperType["scheduledAt"] = 0;
  sentAt: VO.NewspaperType["sentAt"] = null;

  constructor(id: VO.NewspaperType["id"]) {
    this.id = id;
  }

  async build() {
    const events = await EventRepository.find([
      Events.NewspaperScheduledEvent,
      Events.NewspaperGenerateEvent,
      Events.NewspaperSentEvent,
      Events.NewspaperArchivedEvent,
      Events.NewspaperFailedEvent,
    ]);

    for (const event of events) {
      if (
        event.name === Events.NEWSPAPER_SCHEDULED_EVENT &&
        event.payload.id === this.id
      ) {
        this.articles = event.payload.articles;
        this.scheduledAt = event.payload.createdAt;
        this.status = VO.NewspaperStatusEnum.scheduled;
      }

      if (
        event.name === Events.NEWSPAPER_GENERATED_EVENT &&
        event.payload.newspaperId === this.id
      ) {
        this.status = VO.NewspaperStatusEnum.ready_to_send;
      }

      if (
        event.name === Events.NEWSPAPER_SENT_EVENT &&
        event.payload.newspaperId === this.id
      ) {
        this.status = VO.NewspaperStatusEnum.delivered;
        this.sentAt = event.payload.sentAt;
      }

      if (
        event.name === Events.NEWSPAPER_ARCHIVED_EVENT &&
        event.payload.newspaperId === this.id
      ) {
        this.status = VO.NewspaperStatusEnum.archived;
      }

      if (
        event.name === Events.NEWSPAPER_FAILED_EVENT &&
        event.payload.newspaperId === this.id
      ) {
        this.status = VO.NewspaperStatusEnum.error;
      }
    }

    return this;
  }

  static async schedule(articles: VO.ArticleType[]) {
    if (Policies.ArticlesAreSendable.fails(articles)) {
      throw Policies.ArticlesAreSendable.throw();
    }

    const event = Events.NewspaperScheduledEvent.parse({
      name: Events.NEWSPAPER_SCHEDULED_EVENT,
      version: 1,
      payload: { id: UUID.generate(), articles },
    });
    await EventRepository.save(event);
  }

  async generate() {
    if (
      ![
        VO.NewspaperStatusEnum.scheduled,
        VO.NewspaperStatusEnum.error,
      ].includes(this.status)
    ) {
      return null;
    }

    try {
      const readableArticles: VO.ReadableArticleType[] = [];

      for (const article of this.articles) {
        const articleContent = await Services.ArticleContentDownloader.download(
          article.url
        );

        if (!articleContent) continue;

        const readableArticle =
          Services.ReadableArticleContentGenerator.generate({
            content: articleContent,
            url: article.url,
          });

        if (!readableArticle) continue;

        readableArticles.push(readableArticle);
      }

      await new Services.NewspaperFile({
        newspaperId: this.id,
        readableArticles,
      }).save();

      const event = Events.NewspaperGenerateEvent.parse({
        name: Events.NEWSPAPER_GENERATED_EVENT,
        version: 1,
        payload: { newspaperId: this.id },
      });
      await EventRepository.save(event);
    } catch (error) {
      const event = Events.NewspaperFailedEvent.parse({
        name: Events.NEWSPAPER_FAILED_EVENT,
        version: 1,
        payload: { newspaperId: this.id },
      });
      await EventRepository.save(event);
    }
  }

  async send() {
    if (this.status !== VO.NewspaperStatusEnum.ready_to_send) {
      return null;
    }

    try {
      await Services.NewspaperSender.send(this.id);

      const event = Events.NewspaperSentEvent.parse({
        name: Events.NEWSPAPER_SENT_EVENT,
        version: 1,
        payload: {
          newspaperId: this.id,
          articles: this.articles,
          sentAt: Date.now(),
        },
      });
      await EventRepository.save(event);
    } catch (error) {
      const event = Events.NewspaperFailedEvent.parse({
        name: Events.NEWSPAPER_FAILED_EVENT,
        version: 1,
        payload: { newspaperId: this.id },
      });
      await EventRepository.save(event);
    }
  }

  async archive() {
    if (
      ![
        VO.NewspaperStatusEnum.delivered,
        VO.NewspaperStatusEnum.error,
      ].includes(this.status)
    ) {
      return null;
    }

    const event = Events.NewspaperArchivedEvent.parse({
      name: Events.NEWSPAPER_ARCHIVED_EVENT,
      version: 1,
      payload: { newspaperId: this.id },
    });
    await EventRepository.save(event);
  }

  async resend() {
    if (
      ![
        VO.NewspaperStatusEnum.error,
        VO.NewspaperStatusEnum.delivered,
      ].includes(this.status)
    ) {
      return null;
    }

    const event = Events.NewspaperScheduledEvent.parse({
      name: Events.NEWSPAPER_SCHEDULED_EVENT,
      version: 1,
      payload: { id: this.id, articles: this.articles },
    });
    await EventRepository.save(event);
  }
}
