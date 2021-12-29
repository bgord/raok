import { UUID } from "@bgord/node";

import * as Events from "../events";
import * as VO from "../value-objects";

import { EventRepository } from "../repositories/event-repository";

type Article = Pick<VO.ArticleType, "id" | "url">;

export class TableOfContents {
  id = UUID.generate();

  articles: Article[];

  constructor(articles: Article[]) {
    this.articles = articles;
  }

  async scheduleNewspaper() {
    const event = Events.NewspaperScheduledEvent.parse({
      name: Events.NEWSPAPER_SCHEDULED_EVENT,
      version: 1,
      payload: { id: this.id, articles: this.articles },
    });
    await EventRepository.save(event);
  }
}
