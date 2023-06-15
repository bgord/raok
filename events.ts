import * as bg from "@bgord/node";
import { z } from "zod";
import Emittery from "emittery";

import * as VO from "./value-objects";
import * as Services from "./services";
import * as Repos from "./repositories";
import * as Aggregates from "./aggregates";
import * as infra from "./infra";

const EventHandler = new bg.EventHandler(infra.logger);
const EventLogger = new bg.EventLogger(infra.logger);

export const ARTICLE_ADDED_EVENT = "ARTICLE_ADDED_EVENT";
export const ArticleAddedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLE_ADDED_EVENT),
    version: z.literal(1),
    payload: VO.Article.merge(VO.ArticleMetatags),
  })
);
export type ArticleAddedEventType = z.infer<typeof ArticleAddedEvent>;

export const ARTICLE_DELETED_EVENT = "ARTICLE_DELETED_EVENT";
export const ArticleDeletedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLE_DELETED_EVENT),
    version: z.literal(1),
    payload: z.object({ articleId: VO.ArticleId }),
  })
);
export type ArticleDeletedEventType = z.infer<typeof ArticleDeletedEvent>;

export const ARTICLE_LOCKED_EVENT = "ARTICLE_LOCKED_EVENT";
export const ArticleLockedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLE_LOCKED_EVENT),
    version: z.literal(1),
    payload: z.object({ articleId: VO.ArticleId, newspaperId: VO.NewspaperId }),
  })
);
export type ArticleLockedEventType = z.infer<typeof ArticleLockedEvent>;

export const ARTICLE_UNLOCKED_EVENT = "ARTICLE_UNLOCKED_EVENT";
export const ArticleUnlockedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLE_UNLOCKED_EVENT),
    version: z.literal(1),
    payload: z.object({ articleId: VO.ArticleId }),
  })
);
export type ArticleUnlockedEventType = z.infer<typeof ArticleUnlockedEvent>;

export const ARTICLE_PROCESSED_EVENT = "ARTICLE_PROCESSED_EVENT";
export const ArticleProcessedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLE_PROCESSED_EVENT),
    version: z.literal(1),
    payload: z.object({ articleId: VO.ArticleId }),
  })
);
export type ArticleProcessedEventType = z.infer<typeof ArticleProcessedEvent>;

export const ARTICLE_UNDELETE_EVENT = "ARTICLE_UNDELETE_EVENT";
export const ArticleUndeleteEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLE_UNDELETE_EVENT),
    version: z.literal(1),
    payload: z.object({ articleId: VO.ArticleId }),
  })
);
export type ArticleUndeleteEventType = z.infer<typeof ArticleUndeleteEvent>;

export const NEWSPAPER_SCHEDULED_EVENT = "NEWSPAPER_SCHEDULED_EVENT";
export const NewspaperScheduledEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(NEWSPAPER_SCHEDULED_EVENT),
    version: z.literal(1),
    payload: z.object({
      id: VO.NewspaperId,
      articles: VO.Newspaper._def.shape().articles,
      createdAt: bg.Schema.Timestamp,
    }),
  })
);
export type NewspaperScheduledEventType = z.infer<
  typeof NewspaperScheduledEvent
>;

export const NEWSPAPER_GENERATED_EVENT = "NEWSPAPER_GENERATED_EVENT";
export const NewspaperGenerateEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(NEWSPAPER_GENERATED_EVENT),
    version: z.literal(1),
    payload: z.object({ newspaperId: VO.NewspaperId }),
  })
);
export type NewspaperGenerateEventType = z.infer<typeof NewspaperGenerateEvent>;

export const NEWSPAPER_SENT_EVENT = "NEWSPAPER_SENT_EVENT";
export const NewspaperSentEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(NEWSPAPER_SENT_EVENT),
    version: z.literal(1),
    payload: z.object({
      newspaperId: VO.NewspaperId,
      articles: VO.Newspaper._def.shape().articles,
      sentAt: VO.Newspaper._def.shape().sentAt,
    }),
  })
);
export type NewspaperSentEventType = z.infer<typeof NewspaperSentEvent>;

export const NEWSPAPER_ARCHIVED_EVENT = "NEWSPAPER_ARCHIVED_EVENT";
export const NewspaperArchivedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(NEWSPAPER_ARCHIVED_EVENT),
    version: z.literal(1),
    payload: z.object({ newspaperId: VO.NewspaperId }),
  })
);
export type NewspaperArchivedEventType = z.infer<typeof NewspaperArchivedEvent>;

export const NEWSPAPER_FAILED_EVENT = "NEWSPAPER_FAILED_EVENT";
export const NewspaperFailedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(NEWSPAPER_FAILED_EVENT),
    version: z.literal(1),
    payload: z.object({ newspaperId: VO.NewspaperId }),
  })
);
export type NewspaperFailedEventType = z.infer<typeof NewspaperFailedEvent>;

export const ARBITRARY_FILE_SCHEDULED_EVENT = "ARBITRARY_FILE_SCHEDULED_EVENT";
export const ArbitraryFileScheduledEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARBITRARY_FILE_SCHEDULED_EVENT),
    version: z.literal(1),
    payload: bg.Schema.UploadedFile,
  })
);
export type ArbitraryFileScheduledEventType = z.infer<
  typeof ArbitraryFileScheduledEvent
>;

export const ARTICLES_TO_REVIEW_NOTIFICATIONS_DISABLED_EVENT =
  "ARTICLES_TO_REVIEW_NOTIFICATIONS_DISABLED_EVENT";
export const ArticlesToReviewNotificationsDisabledEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLES_TO_REVIEW_NOTIFICATIONS_DISABLED_EVENT),
    version: z.literal(1),
    payload: z.object({}),
  })
);
export type ArticlesToReviewNotificationsDisabledEventType = z.infer<
  typeof ArticlesToReviewNotificationsDisabledEvent
>;

export const ARTICLES_TO_REVIEW_NOTIFICATIONS_ENABLED_EVENT =
  "ARTICLES_TO_REVIEW_NOTIFICATIONS_ENABLED_EVENT";
export const ArticlesToReviewNotificationsEnabledEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLES_TO_REVIEW_NOTIFICATIONS_ENABLED_EVENT),
    version: z.literal(1),
    payload: z.object({}),
  })
);
export type ArticlesToReviewNotificationsEnabledEventType = z.infer<
  typeof ArticlesToReviewNotificationsEnabledEvent
>;

export const ARTICLES_TO_REVIEW_NOTIFICATION_HOUR_SET_EVENT =
  "ARTICLES_TO_REVIEW_NOTIFICATION_HOUR_SET_EVENT";
export const ArticlesToReviewNotificationHourSetEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLES_TO_REVIEW_NOTIFICATION_HOUR_SET_EVENT),
    version: z.literal(1),
    payload: z.object({ hour: bg.Schema.Hour }),
  })
);
export type ArticlesToReviewNotificationHourSetEventType = z.infer<
  typeof ArticlesToReviewNotificationHourSetEvent
>;

export const FEEDLY_ARTICLES_CRAWLING_SCHEDULED_EVENT =
  "FEEDLY_ARTICLES_CRAWLING_SCHEDULED_EVENT";
export const FeedlyArticlesCrawlingScheduledEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(FEEDLY_ARTICLES_CRAWLING_SCHEDULED_EVENT),
    version: z.literal(1),
    payload: z.object({}),
  })
);
export type FeedlyArticlesCrawlingScheduledEventType = z.infer<
  typeof FeedlyArticlesCrawlingScheduledEvent
>;

export const DELETE_OLD_ARTICLES_EVENT = "DELETE_OLD_ARTICLES_EVENT";
export const DeleteOldArticlesEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(DELETE_OLD_ARTICLES_EVENT),
    version: z.literal(1),
    payload: z.object({ marker: VO.ArticleOldMarker }),
  })
);
export type DeleteOldArticlesEventType = z.infer<typeof DeleteOldArticlesEvent>;

export const STOP_FEEDLY_CRAWLING_EVENT = "STOP_FEEDLY_CRAWLING_EVENT";
export const StopFeedlyCrawlingEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(STOP_FEEDLY_CRAWLING_EVENT),
    version: z.literal(1),
    payload: z.object({}),
  })
);
export type StopFeedlyCrawlingEventType = z.infer<
  typeof StopFeedlyCrawlingEvent
>;

export const RESTORE_FEEDLY_CRAWLING_EVENT = "RESTORE_FEEDLY_CRAWLING_EVENT";
export const RestoreFeedlyCrawlingEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(RESTORE_FEEDLY_CRAWLING_EVENT),
    version: z.literal(1),
    payload: z.object({}),
  })
);
export type RestoreFeedlyCrawlingEventType = z.infer<
  typeof RestoreFeedlyCrawlingEvent
>;

export const emittery = new Emittery<{
  ARTICLE_ADDED_EVENT: ArticleAddedEventType;
  ARTICLE_DELETED_EVENT: ArticleDeletedEventType;
  ARTICLE_LOCKED_EVENT: ArticleLockedEventType;
  ARTICLE_UNLOCKED_EVENT: ArticleUnlockedEventType;
  ARTICLE_PROCESSED_EVENT: ArticleProcessedEventType;
  ARTICLE_UNDELETE_EVENT: ArticleUndeleteEventType;
  NEWSPAPER_SCHEDULED_EVENT: NewspaperScheduledEventType;
  NEWSPAPER_GENERATED_EVENT: NewspaperGenerateEventType;
  NEWSPAPER_SENT_EVENT: NewspaperSentEventType;
  NEWSPAPER_ARCHIVED_EVENT: NewspaperArchivedEventType;
  NEWSPAPER_FAILED_EVENT: NewspaperFailedEventType;
  ARBITRARY_FILE_SCHEDULED_EVENT: ArbitraryFileScheduledEventType;
  ARTICLES_TO_REVIEW_NOTIFICATIONS_DISABLED_EVENT: ArticlesToReviewNotificationsDisabledEventType;
  ARTICLES_TO_REVIEW_NOTIFICATIONS_ENABLED_EVENT: ArticlesToReviewNotificationsEnabledEventType;
  ARTICLES_TO_REVIEW_NOTIFICATION_HOUR_SET_EVENT: ArticlesToReviewNotificationHourSetEventType;
  FEEDLY_ARTICLES_CRAWLING_SCHEDULED_EVENT: FeedlyArticlesCrawlingScheduledEventType;
  DELETE_OLD_ARTICLES_EVENT: DeleteOldArticlesEventType;
  STOP_FEEDLY_CRAWLING_EVENT: StopFeedlyCrawlingEventType;
  RESTORE_FEEDLY_CRAWLING_EVENT: RestoreFeedlyCrawlingEventType;
}>({
  debug: {
    enabled: true,
    name: "infra/logger",
    logger: EventLogger.handle,
  },
});

emittery.on(
  ARTICLE_ADDED_EVENT,
  EventHandler.handle(async (event) => {
    await Repos.ArticleRepository.create(event.payload);
    await Repos.StatsRepository.incrementCreatedArticles();

    if (event.payload.source === VO.ArticleSourceEnum.feedly) {
      await Repos.StatsRepository.updateLastFeedlyImport(
        event.payload.createdAt
      );
    }
  })
);

emittery.on(
  ARTICLE_DELETED_EVENT,
  EventHandler.handle(async (event) => {
    await Repos.ArticleRepository.updateStatus(
      event.payload.articleId,
      VO.ArticleStatusEnum.deleted
    );
  })
);

emittery.on(
  ARTICLE_UNDELETE_EVENT,
  EventHandler.handle(async (event) => {
    await Repos.ArticleRepository.updateStatus(
      event.payload.articleId,
      VO.ArticleStatusEnum.ready
    );
  })
);

emittery.on(
  ARTICLE_LOCKED_EVENT,
  EventHandler.handle(async (event) => {
    try {
      await Repos.ArticleRepository.updateStatus(
        event.payload.articleId,
        VO.ArticleStatusEnum.in_progress
      );

      await Repos.ArticleRepository.assignToNewspaper(
        event.payload.articleId,
        event.payload.newspaperId
      );
    } catch (error) {
      infra.logger.error({
        message: "Article locked event handler error",
        operation: "db_error",
        metadata: infra.logger.formatError(error),
      });
    }
  })
);

emittery.on(
  ARTICLE_UNLOCKED_EVENT,
  EventHandler.handle(async (event) => {
    await Repos.ArticleRepository.updateStatus(
      event.payload.articleId,
      VO.ArticleStatusEnum.ready
    );
  })
);

emittery.on(
  ARTICLE_PROCESSED_EVENT,
  EventHandler.handle(async (event) => {
    await Repos.ArticleRepository.updateStatus(
      event.payload.articleId,
      VO.ArticleStatusEnum.processed
    );
  })
);

emittery.on(
  NEWSPAPER_SCHEDULED_EVENT,
  EventHandler.handle(async (event) => {
    await Repos.NewspaperRepository.create({
      id: event.payload.id,
      scheduledAt: event.payload.createdAt,
      status: VO.NewspaperStatusEnum.scheduled,
    });

    for (const entity of event.payload.articles) {
      const article = await new Aggregates.Article(entity.id).build();
      await article.lock(event.payload.id);
    }

    const newspaper = await new Aggregates.Newspaper(event.payload.id).build();

    await newspaper.generate();
  })
);

emittery.on(
  NEWSPAPER_GENERATED_EVENT,
  EventHandler.handle(async (event) => {
    await Repos.NewspaperRepository.updateStatus(
      event.payload.newspaperId,
      VO.NewspaperStatusEnum.ready_to_send
    );

    const newspaper = await new Aggregates.Newspaper(
      event.payload.newspaperId
    ).build();
    await newspaper.send();
  })
);

emittery.on(
  NEWSPAPER_SENT_EVENT,
  EventHandler.handle(async (event) => {
    await Repos.StatsRepository.incrementSentNewspapers();

    await Repos.NewspaperRepository.updateStatus(
      event.payload.newspaperId,
      VO.NewspaperStatusEnum.delivered
    );

    await Repos.NewspaperRepository.updateSentAt(
      event.payload.newspaperId,
      event.payload.sentAt
    );

    for (const entity of event.payload.articles) {
      const article = await new Aggregates.Article(entity.id).build();
      await article.markAsProcessed();
    }

    await Services.NewspaperFile.clear(event.payload.newspaperId);
  })
);

emittery.on(
  NEWSPAPER_ARCHIVED_EVENT,
  EventHandler.handle(async (event) => {
    await Repos.NewspaperRepository.updateStatus(
      event.payload.newspaperId,
      VO.NewspaperStatusEnum.archived
    );
  })
);

emittery.on(
  NEWSPAPER_FAILED_EVENT,
  EventHandler.handle(async (event) => {
    await Repos.NewspaperRepository.updateStatus(
      event.payload.newspaperId,
      VO.NewspaperStatusEnum.error
    );

    const newspaper = await new Aggregates.Newspaper(
      event.payload.newspaperId
    ).build();

    for (const item of newspaper.articles) {
      const article = await new Aggregates.Article(item.id).build();
      await article.unlock();
    }
  })
);

emittery.on(
  FEEDLY_ARTICLES_CRAWLING_SCHEDULED_EVENT,
  EventHandler.handle(async () => {
    await Services.FeedlyArticlesCrawler.run();
  })
);

emittery.on(
  ARBITRARY_FILE_SCHEDULED_EVENT,
  EventHandler.handle(async (event) => {
    const file = event.payload;

    try {
      await Services.ArbitraryFileSender.send(file);

      infra.logger.info({
        message: "Mailer success",
        operation: "mailer_success",
        metadata: { filename: file.originalFilename },
      });

      await Repos.FilesRepository.add(file);
    } catch (error) {
      infra.logger.error({
        message: "Mailer error while sending file",
        operation: "mailer_error",
        metadata: {
          filename: file.originalFilename,
          error: infra.logger.formatError(error),
        },
      });
    }
  })
);

emittery.on(
  DELETE_OLD_ARTICLES_EVENT,
  EventHandler.handle(async (event) => {
    const oldArticles = await Repos.ArticleRepository.getOld(
      event.payload.marker
    );

    if (!oldArticles.length) return;

    infra.logger.info({
      message: "Deleting old articles",
      operation: "old_articles_delete",
      metadata: { count: oldArticles.length },
    });

    for (const { id } of oldArticles) {
      const articleId = VO.ArticleId.parse(id);
      const article = await new Aggregates.Article(articleId).build();
      await article.delete();
    }
  })
);
