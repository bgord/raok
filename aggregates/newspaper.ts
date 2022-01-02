import { Mailer, Reporter, UUID } from "@bgord/node";

import * as Events from "../events";
import * as VO from "../value-objects";
import * as Services from "../services";

import { Env } from "../env";
import { EventRepository } from "../repositories/event-repository";

const mailer = new Mailer({
  SMTP_HOST: Env.SMTP_HOST,
  SMTP_PORT: Env.SMTP_PORT,
  SMTP_USER: Env.SMTP_USER,
  SMTP_PASS: Env.SMTP_PASS,
});

export class Newspaper {
  id: VO.NewspaperType["id"];
  status: VO.NewspaperType["status"] = VO.NewspaperStatusEnum.undetermined;
  articles: VO.NewspaperType["articles"] = [];
  scheduledAt: VO.NewspaperType["scheduledAt"] = 0;

  constructor(id: VO.NewspaperType["id"]) {
    this.id = id;
  }

  async build() {
    const events = await EventRepository.find([
      Events.NewspaperScheduledEvent,
      Events.NewspaperGenerateEvent,
      Events.NewspaperSentEvent,
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
      }
    }

    return this;
  }

  static async schedule(articles: VO.ArticleType[]) {
    const event = Events.NewspaperScheduledEvent.parse({
      name: Events.NEWSPAPER_SCHEDULED_EVENT,
      version: 1,
      payload: { id: UUID.generate(), articles },
    });
    await EventRepository.save(event);
  }

  async generate() {
    const readableArticles: VO.ReadableArticleType[] = [];

    for (const article of this.articles) {
      const articleContent = await Services.ArticleContentDownloader.download(
        article.url
      );

      if (!articleContent) continue;

      const readableArticle = Services.ReadableArticleContentGenerator.generate(
        { content: articleContent, url: article.url }
      );

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
  }

  async send() {
    try {
      await mailer.send({
        from: Env.SMTP_USER,
        to: Env.EMAIL_TO_DELIVER_TO,
        subject: "Newspaper",
        attachments: [
          {
            filename: "newspaper.mobi",
            path: Services.NewspaperFile.getPaths(this.id).mobi,
          },
        ],
      });

      const event = Events.NewspaperSentEvent.parse({
        name: Events.NEWSPAPER_SENT_EVENT,
        version: 1,
        payload: { newspaperId: this.id, articles: this.articles },
      });
      await EventRepository.save(event);
    } catch (error) {
      Reporter.error(`Newspaper not sent [id=${this.id}]`);
    }
  }
}
