import * as Events from "../events";
import * as VO from "../value-objects";

import { EventRepository } from "../repositories/event-repository";

export class Articles {
  articles: VO.ArticleType[] = [];

  async build() {
    const events = await EventRepository.find([Events.ArticleAddedEvent]);

    const articles: VO.ArticleType[] = [];

    for (const event of events) {
      if (event.name === Events.ARTICLE_ADDED_EVENT) {
        articles.push({
          id: event.payload.id,
          url: event.payload.url,
          source: event.payload.source,
          createdAt: event.payload.createdAt,
        });
      }
    }

    this.articles = articles;

    return this;
  }

  static async addArticle(payload: Record<"url", unknown>) {
    const url = VO.Article._def.shape().url.parse(payload.url);

    const event = Events.ArticleAddedEvent.parse({
      name: Events.ARTICLE_ADDED_EVENT,
      version: 1,
      payload: { url, source: VO.ArticleSourceEnum.web },
    });
    await EventRepository.save(event);
  }
}
