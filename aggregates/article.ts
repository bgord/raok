import { UUID } from "@bgord/node";

import * as Events from "../events";
import * as VO from "../value-objects";
import * as Policies from "../policies";
import * as Services from "../services";

import { EventRepository } from "../repositories/event-repository";

export class Article {
  id: VO.ArticleType["id"];

  stream: Events.StreamType;

  entity: VO.ArticleType | null = null;

  constructor(id: VO.ArticleType["id"]) {
    this.id = id;
    this.stream = Article.getStream(id);
  }

  async build() {
    const events = await EventRepository.find(
      [
        Events.ArticleAddedEvent,
        Events.ArticleDeletedEvent,
        Events.ArticleLockedEvent,
        Events.ArticleProcessedEvent,
        Events.ArticleAddedToFavouritesEvent,
        Events.ArticleDeletedFromFavouritesEvent,
      ],
      Article.getStream(this.id)
    );

    for (const event of events) {
      switch (event.name) {
        case Events.ARTICLE_ADDED_EVENT:
          this.entity = event.payload;
          this.entity.favourite = VO.ArticleFavourite.parse(false);
          break;

        case Events.ARTICLE_DELETED_EVENT:
          this.entity = null;
          break;

        case Events.ARTICLE_LOCKED_EVENT:
          if (!this.entity) continue;
          this.entity.status = VO.ArticleStatusEnum.in_progress;
          break;

        case Events.ARTICLE_PROCESSED_EVENT:
          if (!this.entity) continue;
          this.entity.status = VO.ArticleStatusEnum.processed;
          break;

        case Events.ARTICLE_ADDED_TO_FAVOURITES:
          if (!this.entity) continue;
          this.entity.favourite = VO.ArticleFavourite.parse(true);
          break;

        case Events.ARTICLE_DELETED_FROM_FAVOURITES:
          if (!this.entity) continue;
          this.entity.favourite = VO.ArticleFavourite.parse(false);
          break;

        default:
          continue;
      }
    }

    return this;
  }

  static async add(newArticle: {
    url: VO.ArticleUrlType;
    source?: VO.ArticleSourceEnum;
  }) {
    const newArticleSource = newArticle.source ?? VO.ArticleSourceEnum.web;
    const newArticleId = VO.ArticleId.parse(UUID.generate());

    if (newArticleSource === VO.ArticleSourceEnum.web) {
      await Policies.NonProcessedArticleUrlIsUnique.perform({
        articleUrl: newArticle.url,
      });
    }

    if (newArticleSource === VO.ArticleSourceEnum.feedly) {
      await Policies.ArticleUrlIsUnique.perform({ articleUrl: newArticle.url });
    }

    const metatags = await Services.ArticleMetatagsScraper.get(newArticle.url);

    await EventRepository.save(
      Events.ArticleAddedEvent.parse({
        name: Events.ARTICLE_ADDED_EVENT,
        stream: Article.getStream(newArticleId),
        version: 1,
        payload: {
          id: newArticleId,
          url: newArticle.url,
          source: newArticleSource,
          status: VO.ArticleStatusEnum.ready,
          favourite: false,
          ...metatags,
        },
      })
    );
  }

  async delete() {
    if (!this.entity) return;

    await Policies.ArticleShouldExist.perform({ entity: this.entity });
    await Policies.ArticleWasNotProcessed.perform({
      entity: this.entity as VO.ArticleType,
    });

    await EventRepository.save(
      Events.ArticleDeletedEvent.parse({
        name: Events.ARTICLE_DELETED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { articleId: this.id },
      })
    );
  }

  async lock(newspaperId: VO.NewspaperIdType) {
    if (!this.entity) return;

    await Policies.ArticleStatusTransition.perform({
      from: this.entity.status,
      to: VO.ArticleStatusEnum.in_progress,
    });

    await EventRepository.save(
      Events.ArticleLockedEvent.parse({
        name: Events.ARTICLE_LOCKED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { articleId: this.id, newspaperId },
      })
    );
  }

  async markAsProcessed() {
    if (!this.entity) return;

    await Policies.ArticleStatusTransition.perform({
      from: this.entity.status,
      to: VO.ArticleStatusEnum.processed,
    });

    await EventRepository.save(
      Events.ArticleProcessedEvent.parse({
        name: Events.ARTICLE_PROCESSED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { articleId: this.id },
      })
    );
  }

  async addToFavourites() {
    if (!this.entity) return;

    await Policies.FavouriteArticle.perform({ entity: this.entity });

    await EventRepository.save(
      Events.ArticleAddedToFavouritesEvent.parse({
        name: Events.ARTICLE_ADDED_TO_FAVOURITES,
        stream: this.stream,
        version: 1,
        payload: { articleId: this.id },
      })
    );
  }

  async deleteFromFavourites() {
    if (!this.entity) return;

    await Policies.UnfavouriteArticle.perform({ entity: this.entity });

    await EventRepository.save(
      Events.ArticleDeletedFromFavouritesEvent.parse({
        name: Events.ARTICLE_DELETED_FROM_FAVOURITES,
        stream: this.stream,
        version: 1,
        payload: { articleId: this.id },
      })
    );
  }

  static getStream(id: VO.ArticleIdType) {
    return `article_${id}`;
  }
}
