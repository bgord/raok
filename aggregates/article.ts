import _ from "lodash";

import * as Events from "../events";
import * as VO from "../value-objects";
import * as Policies from "../policies";

import { EventRepository } from "../repositories/event-repository";

export class Article {
  id: VO.ArticleType["id"];
  entity: VO.ArticleType | null = null;

  constructor(id: VO.ArticleType["id"]) {
    this.id = id;
  }

  async build() {
    const events = await EventRepository.find([
      Events.ArticleAddedEvent,
      Events.ArticleDeletedEvent,
      Events.NewspaperScheduledEvent,
    ]);

    for (const event of events) {
      if (
        event.name === Events.ARTICLE_ADDED_EVENT &&
        this.id === event.payload.id
      ) {
        this.entity = event.payload;
      }

      if (event.name === Events.ARTICLE_DELETED_EVENT) {
        this.entity = null;
      }

      if (
        event.name === Events.NEWSPAPER_SCHEDULED_EVENT &&
        event.payload.articles.some((article) => article.id === this.id)
      ) {
        if (this.entity) {
          this.entity.status = VO.ArticleStatusEnum.in_progress;
        }
      }
    }

    return this;
  }

  static async add(payload: Record<"url", unknown>) {
    const articleUrl = VO.Article._def.shape().url.parse(payload.url);

    if (await Policies.ArticleUrlIsUnique.fails(articleUrl)) {
      throw new Policies.ArticleUrlIsNotUniqueError();
    }

    const event = Events.ArticleAddedEvent.parse({
      name: Events.ARTICLE_ADDED_EVENT,
      version: 1,
      payload: {
        url: articleUrl,
        source: VO.ArticleSourceEnum.web,
        status: VO.ArticleStatusEnum.ready,
      },
    });
    await EventRepository.save(event);
  }

  async delete() {
    if (this.entity === null) {
      throw new Policies.ArticleDoesNotExistError();
    }

    const event = Events.ArticleDeletedEvent.parse({
      name: Events.ARTICLE_DELETED_EVENT,
      version: 1,
      payload: { articleId: this.id },
    });
    await EventRepository.save(event);
  }
}
