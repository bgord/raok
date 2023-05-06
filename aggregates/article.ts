import * as bg from "@bgord/node";

import * as Events from "../events";
import * as VO from "../value-objects";
import * as Policies from "../policies";
import * as Services from "../services";
import * as Repos from "../repositories";

export class Article {
  id: VO.ArticleType["id"];

  stream: bg.EventType["stream"];

  entity: VO.ArticleType | null = null;

  static ARTICLE_OLD_MARKER_IN_DAYS = VO.ARTICLE_OLD_MARKER_IN_DAYS;

  constructor(id: VO.ArticleType["id"]) {
    this.id = id;
    this.stream = Article.getStream(id);
  }

  async build() {
    const events = await Repos.EventRepository.find(
      [
        Events.ArticleAddedEvent,
        Events.ArticleDeletedEvent,
        Events.ArticleLockedEvent,
        Events.ArticleProcessedEvent,
        Events.ArticleUndeleteEvent,
      ],
      Article.getStream(this.id)
    );

    for (const event of events) {
      switch (event.name) {
        case Events.ARTICLE_ADDED_EVENT:
          this.entity = event.payload;
          break;

        case Events.ARTICLE_DELETED_EVENT:
          if (!this.entity) continue;
          this.entity.status = VO.ArticleStatusEnum.deleted;
          break;

        case Events.ARTICLE_LOCKED_EVENT:
          if (!this.entity) continue;
          this.entity.status = VO.ArticleStatusEnum.in_progress;
          break;

        case Events.ARTICLE_PROCESSED_EVENT:
          if (!this.entity) continue;
          this.entity.status = VO.ArticleStatusEnum.processed;
          break;

        case Events.ARTICLE_UNDELETE_EVENT:
          if (!this.entity) continue;
          this.entity.status = VO.ArticleStatusEnum.ready;
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
    const newArticleId = VO.ArticleId.parse(bg.NewUUID.generate());

    await Policies.NonProcessedArticleUrlIsUnique.perform({
      articleUrl: newArticle.url,
    });

    const metatags = await Services.ArticleMetatagsScraper.get(newArticle.url);

    await Repos.EventRepository.save(
      Events.ArticleAddedEvent.parse({
        name: Events.ARTICLE_ADDED_EVENT,
        stream: Article.getStream(newArticleId),
        version: 1,
        payload: {
          id: newArticleId,
          url: newArticle.url,
          source: newArticleSource,
          status: VO.ArticleStatusEnum.ready,
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

    await Repos.EventRepository.save(
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

    await Repos.EventRepository.save(
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

    await Repos.EventRepository.save(
      Events.ArticleProcessedEvent.parse({
        name: Events.ARTICLE_PROCESSED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { articleId: this.id },
      })
    );
  }

  async undelete() {
    if (!this.entity) return;

    await Policies.ArticleStatusTransition.perform({
      from: this.entity.status,
      to: VO.ArticleStatusEnum.ready,
    });

    await Repos.EventRepository.save(
      Events.ArticleUndeleteEvent.parse({
        name: Events.ARTICLE_UNDELETE_EVENT,
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
