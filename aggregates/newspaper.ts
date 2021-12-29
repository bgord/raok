import * as Events from "../events";
import * as VO from "../value-objects";
import * as Services from "../services";

import { EventRepository } from "../repositories/event-repository";

export class Newspaper {
  id: VO.NewspaperType["id"];
  status: VO.NewspaperType["status"] = VO.NewspaperStatusEnum.undetermined;
  articles: VO.NewspaperType["articles"] = [];
  scheduledAt: VO.NewspaperType["scheduledAt"] = 0;

  constructor(id: VO.NewspaperType["id"]) {
    this.id = id;
  }

  async build() {
    const events = await EventRepository.find([Events.NewspaperScheduledEvent]);

    for (const event of events) {
      if (
        event.name === Events.NEWSPAPER_SCHEDULED_EVENT &&
        event.payload.id === this.id
      ) {
        this.articles = event.payload.articles;
        this.scheduledAt = event.payload.createdAt;
        this.status = VO.NewspaperStatusEnum.scheduled;
      }
    }

    return this;
  }

  async generate() {
    const result = [];

    for (const article of this.articles) {
      const content = await Services.ArticleContentDownloader.download(
        article.url
      );
      result.push(content);
    }

    this.status = VO.NewspaperStatusEnum.ready_to_send;
  }
}
