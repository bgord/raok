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
      Events.ArticleLockedEvent,
      Events.NewspaperSentEvent,
    ]);

    for (const event of events) {
      if (
        event.name === Events.ARTICLE_ADDED_EVENT &&
        this.id === event.payload.id
      ) {
        this.entity = event.payload;
      }

      if (
        event.name === Events.ARTICLE_DELETED_EVENT &&
        this.id === event.payload.articleId
      ) {
        this.entity = null;
      }

      if (
        event.name === Events.ARTICLE_LOCKED_EVENT &&
        this.id === event.payload.articleId
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

  static async add(newArticle: {
    url: VO.ArticleUrlType;
    source?: VO.ArticleSourceEnum;
  }) {
    const newArticleSource = newArticle.source ?? VO.ArticleSourceEnum.web;

    if (newArticleSource === VO.ArticleSourceEnum.web) {
      await Policies.NonProcessedArticleUrlIsUnique.perform({
        articleUrl: newArticle.url,
      });
    }

    if (newArticleSource === VO.ArticleSourceEnum.feedly) {
      await Policies.ArticleUrlIsUnique.perform({ articleUrl: newArticle.url });
    }

    await EventRepository.save(
      Events.ArticleAddedEvent.parse({
        name: Events.ARTICLE_ADDED_EVENT,
        version: 1,
        payload: {
          url: newArticle.url,
          source: newArticleSource,
          status: VO.ArticleStatusEnum.ready,
        },
      })
    );
  }

  async delete() {
    await Policies.ArticleShouldExist.perform({ entity: this.entity });
    await Policies.ArticleWasNotProcessed.perform({
      entity: this.entity as VO.ArticleType,
    });

    await EventRepository.save(
      Events.ArticleDeletedEvent.parse({
        name: Events.ARTICLE_DELETED_EVENT,
        version: 1,
        payload: { articleId: this.id },
      })
    );
  }

  async lock(newspaperId: VO.NewspaperIdType) {
    if (!this.entity) return;

    await EventRepository.save(
      Events.ArticleLockedEvent.parse({
        name: Events.ARTICLE_LOCKED_EVENT,
        version: 1,
        payload: { articleId: this.id, newspaperId },
      })
    );
  }

  async markAsProcessed() {
    if (!this.entity) return;

    await EventRepository.save(
      Events.ArticleProcessedEvent.parse({
        name: Events.ARTICLE_PROCESSED_EVENT,
        version: 1,
        payload: { articleId: this.id },
      })
    );
  }
}
