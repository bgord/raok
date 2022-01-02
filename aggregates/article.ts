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
      Events.NewspaperSentEvent,
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

      if (
        event.name === Events.NEWSPAPER_SENT_EVENT &&
        event.payload.articles.some((article) => article.id === this.id)
      ) {
        if (this.entity) {
          this.entity.status = VO.ArticleStatusEnum.processed;
        }
      }
    }

    return this;
  }

  static async add(payload: { url: unknown; source?: VO.ArticleSourceEnum }) {
    const articleSource = payload.source ?? VO.ArticleSourceEnum.web;
    const articleUrl = VO.Article._def.shape().url.parse(payload.url);

    if (
      articleSource === VO.ArticleSourceEnum.web &&
      (await Policies.NonProcessedArticleUrlIsUnique.fails(articleUrl))
    ) {
      throw Policies.NonProcessedArticleUrlIsUnique.throw();
    }

    if (
      articleSource === VO.ArticleSourceEnum.feedly &&
      (await Policies.ArticleUrlIsUnique.fails(articleUrl))
    ) {
      throw Policies.ArticleUrlIsUnique.throw();
    }

    const event = Events.ArticleAddedEvent.parse({
      name: Events.ARTICLE_ADDED_EVENT,
      version: 1,
      payload: {
        url: articleUrl,
        source: articleSource,
        status: VO.ArticleStatusEnum.ready,
      },
    });
    await EventRepository.save(event);
  }

  async delete() {
    if (Policies.ArticleShouldExist.fails(this.entity)) {
      Policies.ArticleShouldExist.throw();
    }

    if (Policies.ArticleWasNotProcessed.fails(this.entity as VO.ArticleType)) {
      throw Policies.ArticleWasNotProcessed.throw();
    }

    const event = Events.ArticleDeletedEvent.parse({
      name: Events.ARTICLE_DELETED_EVENT,
      version: 1,
      payload: { articleId: this.id },
    });
    await EventRepository.save(event);
  }
}
