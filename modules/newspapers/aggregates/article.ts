import * as bg from "@bgord/node";

import * as Events from "../events";
import * as VO from "../value-objects";
import * as Policies from "../policies";
import * as Services from "../services";
import * as infra from "../../../infra";

export class Article {
  private readonly id: VO.ArticleType["id"];

  private readonly stream: bg.EventType["stream"];

  readonly entity: VO.ArticleType;

  private constructor(
    article: VO.ArticleType,
    readonly revision: bg.Schema.RevisionType,
  ) {
    this.id = article.id;
    this.entity = article;
    this.stream = Article.getStream(article.id);
  }

  static async build(id: VO.ArticleIdType) {
    let entity: VO.ArticleType | null = null;
    let revision: bg.Schema.RevisionType = bg.Revision.initial;

    const events = await infra.EventStore.find(
      [
        Events.ArticleAddedEvent,
        Events.ArticleDeletedEvent,
        Events.ArticleLockedEvent,
        Events.ArticleUnlockedEvent,
        Events.ArticleProcessedEvent,
        Events.ArticleUndeleteEvent,
        Events.ArticleReadEvent,
      ],
      Article.getStream(id),
    );

    for (const event of events) {
      switch (event.name) {
        case Events.ARTICLE_ADDED_EVENT:
          entity = event.payload;
          revision = event.payload.revision;
          break;

        case Events.ARTICLE_DELETED_EVENT:
          if (!entity) continue;
          entity.status = VO.ArticleStatusEnum.deleted;
          revision = event.payload.revision;
          break;

        case Events.ARTICLE_LOCKED_EVENT:
          if (!entity) continue;
          entity.status = VO.ArticleStatusEnum.in_progress;
          revision = event.payload.revision;
          break;

        case Events.ARTICLE_PROCESSED_EVENT:
          if (!entity) continue;
          entity.status = VO.ArticleStatusEnum.processed;
          revision = event.payload.revision;
          break;

        case Events.ARTICLE_READ_EVENT:
          if (!entity) continue;
          entity.status = VO.ArticleStatusEnum.read;
          revision = event.payload.revision;
          break;

        case Events.ARTICLE_UNLOCKED_EVENT:
        case Events.ARTICLE_UNDELETE_EVENT:
          if (!entity) continue;
          entity.status = VO.ArticleStatusEnum.ready;
          revision = event.payload.revision;
          break;

        default:
          continue;
      }
    }

    return new Article(entity as VO.ArticleType, revision);
  }

  static async add(article: Pick<VO.ArticleType, "source" | "url">) {
    const id = VO.ArticleId.parse(bg.NewUUID.generate());

    if (article.source === VO.ArticleSourceEnum.rss) {
      await Policies.ArticleUrlIsUnique.perform(article);
    } else {
      await Policies.NonProcessedArticleUrlIsUnique.perform(article);
    }

    const metatags = await Services.ArticleMetatagsScraper.get(article.url);
    await Policies.ArticleTitleNotBlacklisted.perform(metatags);

    await infra.EventStore.save(
      Events.ArticleAddedEvent.parse({
        name: Events.ARTICLE_ADDED_EVENT,
        stream: Article.getStream(id),
        version: 1,
        payload: {
          id,
          url: article.url,
          source: article.source,
          status: VO.ArticleStatusEnum.ready,
          createdAt: Date.now(),
          estimatedReadingTimeInMinutes: null,
          revision: bg.Revision.initial,
          ...metatags,
        },
      } satisfies Events.ArticleAddedEventType),
    );
  }

  async delete(revision: bg.Revision) {
    revision.validate(this.revision);
    await Policies.ArticleShouldExist.perform({ entity: this.entity });
    await Policies.ArticleWasNotProcessed.perform({
      entity: this.entity as VO.ArticleType,
    });

    await infra.EventStore.save(
      Events.ArticleDeletedEvent.parse({
        name: Events.ARTICLE_DELETED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { articleId: this.id, revision: revision.next().value },
      } satisfies Events.ArticleDeletedEventType),
    );
  }

  async lock(newspaperId: VO.NewspaperIdType, revision: bg.Revision) {
    revision.validate(this.revision);
    await Policies.ArticleStatusTransition.perform({
      from: this.entity.status,
      to: VO.ArticleStatusEnum.in_progress,
    });

    await infra.EventStore.save(
      Events.ArticleLockedEvent.parse({
        name: Events.ARTICLE_LOCKED_EVENT,
        stream: this.stream,
        version: 1,
        payload: {
          articleId: this.id,
          newspaperId,
          revision: revision.next().value,
        },
      } satisfies Events.ArticleLockedEventType),
    );
  }

  async unlock(revision: bg.Revision) {
    revision.validate(this.revision);
    await Policies.ArticleStatusTransition.perform({
      from: this.entity.status,
      to: VO.ArticleStatusEnum.ready,
    });

    await infra.EventStore.save(
      Events.ArticleUnlockedEvent.parse({
        name: Events.ARTICLE_UNLOCKED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { articleId: this.id, revision: revision.next().value },
      } satisfies Events.ArticleUnlockedEventType),
    );
  }

  async markAsProcessed(revision: bg.Revision) {
    revision.validate(this.revision);
    await Policies.ArticleStatusTransition.perform({
      from: this.entity.status,
      to: VO.ArticleStatusEnum.processed,
    });

    await infra.EventStore.save(
      Events.ArticleProcessedEvent.parse({
        name: Events.ARTICLE_PROCESSED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { articleId: this.id, revision: revision.next().value },
      } satisfies Events.ArticleProcessedEventType),
    );
  }

  async markAsRead(revision: bg.Revision) {
    revision.validate(this.revision);
    await Policies.ArticleStatusTransition.perform({
      from: this.entity.status,
      to: VO.ArticleStatusEnum.read,
    });

    await infra.EventStore.save(
      Events.ArticleReadEvent.parse({
        name: Events.ARTICLE_READ_EVENT,
        stream: this.stream,
        version: 1,
        payload: { articleId: this.id, revision: revision.next().value },
      } satisfies Events.ArticleReadEventType),
    );
  }

  async opened() {
    await infra.EventStore.save(
      Events.ArticleOpenedEvent.parse({
        name: Events.ARTICLE_OPENED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { articleId: this.id },
      } satisfies Events.ArticleOpenedEventType),
    );
  }

  async homepageOpened() {
    await infra.EventStore.save(
      Events.ArticleHomepageOpenedEvent.parse({
        name: Events.ARTICLE_HOMEPAGE_OPENED_EVENT,
        stream: this.stream,
        version: 1,
        payload: { articleId: this.id },
      } satisfies Events.ArticleHomepageOpenedEventType),
    );
  }

  async undelete(revision: bg.Revision) {
    revision.validate(this.revision);
    await Policies.ArticleStatusTransition.perform({
      from: this.entity.status,
      to: VO.ArticleStatusEnum.ready,
    });

    await infra.EventStore.save(
      Events.ArticleUndeleteEvent.parse({
        name: Events.ARTICLE_UNDELETE_EVENT,
        stream: this.stream,
        version: 1,
        payload: { articleId: this.id, revision: revision.next().value },
      } satisfies Events.ArticleUndeleteEventType),
    );
  }

  static getStream(id: VO.ArticleIdType) {
    return `article_${id}`;
  }
}
