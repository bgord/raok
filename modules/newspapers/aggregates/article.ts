import * as bg from "@bgord/node";

import * as Events from "../events";
import * as VO from "../value-objects";
import * as Policies from "../policies";
import * as Services from "../services";
import * as infra from "../../../infra";

export class Article {
  id: VO.ArticleType["id"];

  stream: bg.EventType["stream"];

  entity: VO.ArticleType;

  static ARTICLE_OLD_MARKER_IN_DAYS = VO.ARTICLE_OLD_MARKER_IN_DAYS;

  private constructor(article: VO.ArticleType) {
    this.id = article.id;
    this.entity = article;
    this.stream = Article.getStream(article.id);
  }

  static async build(id: VO.ArticleIdType) {
    let entity: VO.ArticleType | null = null;

    const events = await infra.EventStore.find(
      [
        Events.ArticleAddedEvent,
        Events.ArticleDeletedEvent,
        Events.ArticleLockedEvent,
        Events.ArticleUnlockedEvent,
        Events.ArticleProcessedEvent,
        Events.ArticleUndeleteEvent,
      ],
      Article.getStream(id)
    );

    for (const event of events) {
      switch (event.name) {
        case Events.ARTICLE_ADDED_EVENT:
          entity = event.payload;
          break;

        case Events.ARTICLE_DELETED_EVENT:
          if (!entity) continue;
          entity.status = VO.ArticleStatusEnum.deleted;
          break;

        case Events.ARTICLE_LOCKED_EVENT:
          if (!entity) continue;
          entity.status = VO.ArticleStatusEnum.in_progress;
          break;

        case Events.ARTICLE_PROCESSED_EVENT:
          if (!entity) continue;
          entity.status = VO.ArticleStatusEnum.processed;
          break;

        case Events.ARTICLE_UNLOCKED_EVENT:
        case Events.ARTICLE_UNDELETE_EVENT:
          if (!entity) continue;
          entity.status = VO.ArticleStatusEnum.ready;
          break;

        default:
          continue;
      }
    }

    return new Article(entity as VO.ArticleType);
  }

  static async add(article: {
    url: VO.ArticleUrlType;
    source?: VO.ArticleSourceEnum;
  }) {
    const id = VO.ArticleId.parse(bg.NewUUID.generate());
    const source = article.source ?? VO.ArticleSourceEnum.web;

    if (source === VO.ArticleSourceEnum.rss) {
      await Policies.ArticleUrlIsUnique.perform({ articleUrl: article.url });
    }

    if (source !== VO.ArticleSourceEnum.rss) {
      await Policies.NonProcessedArticleUrlIsUnique.perform({
        articleUrl: article.url,
      });
    }

    const metatags = await Services.ArticleMetatagsScraper.get(article.url);

    await infra.EventStore.save(
      Events.ArticleAddedEvent.parse({
        name: Events.ARTICLE_ADDED_EVENT,
        stream: Article.getStream(id),
        version: 1,
        payload: {
          id,
          url: article.url,
          source,
          status: VO.ArticleStatusEnum.ready,
          ...metatags,
        },
      })
    );
  }

  async delete() {
    await Policies.ArticleShouldExist.perform({ entity: this.entity });
    await Policies.ArticleWasNotProcessed.perform({
      entity: this.entity as VO.ArticleType,
    });

    await infra.EventStore.save(
      Events.ArticleDeletedEvent.parse({
        name: Events.ARTICLE_DELETED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { articleId: this.id },
      })
    );
  }

  async lock(newspaperId: VO.NewspaperIdType) {
    await Policies.ArticleStatusTransition.perform({
      from: this.entity.status,
      to: VO.ArticleStatusEnum.in_progress,
    });

    await infra.EventStore.save(
      Events.ArticleLockedEvent.parse({
        name: Events.ARTICLE_LOCKED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { articleId: this.id, newspaperId },
      })
    );
  }

  async unlock() {
    await Policies.ArticleStatusTransition.perform({
      from: this.entity.status,
      to: VO.ArticleStatusEnum.ready,
    });

    await infra.EventStore.save(
      Events.ArticleUnlockedEvent.parse({
        name: Events.ARTICLE_UNLOCKED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { articleId: this.id },
      })
    );
  }

  async markAsProcessed() {
    await Policies.ArticleStatusTransition.perform({
      from: this.entity.status,
      to: VO.ArticleStatusEnum.processed,
    });

    await infra.EventStore.save(
      Events.ArticleProcessedEvent.parse({
        name: Events.ARTICLE_PROCESSED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { articleId: this.id },
      })
    );
  }

  async undelete() {
    await Policies.ArticleStatusTransition.perform({
      from: this.entity.status,
      to: VO.ArticleStatusEnum.ready,
    });

    await infra.EventStore.save(
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
