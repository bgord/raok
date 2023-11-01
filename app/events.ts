/* eslint-disable sonarjs/no-identical-functions */
import * as bg from "@bgord/node";
import Emittery from "emittery";

import * as Settings from "../modules/settings";
import * as Stats from "../modules/stats";
import * as Files from "../modules/files";
import * as Newspapers from "../modules/newspapers";

import * as infra from "../infra";

const EventHandler = new bg.EventHandler(infra.logger);
const EventLogger = new bg.EventLogger(infra.logger);

export const emittery = new Emittery<{
  ARTICLE_ADDED_EVENT: Newspapers.Events.ArticleAddedEventType;
  ARTICLE_DELETED_EVENT: Newspapers.Events.ArticleDeletedEventType;
  ARTICLE_LOCKED_EVENT: Newspapers.Events.ArticleLockedEventType;
  ARTICLE_UNLOCKED_EVENT: Newspapers.Events.ArticleUnlockedEventType;
  ARTICLE_PROCESSED_EVENT: Newspapers.Events.ArticleProcessedEventType;
  ARTICLE_UNDELETE_EVENT: Newspapers.Events.ArticleUndeleteEventType;
  NEWSPAPER_SCHEDULED_EVENT: Newspapers.Events.NewspaperScheduledEventType;
  NEWSPAPER_GENERATED_EVENT: Newspapers.Events.NewspaperGenerateEventType;
  NEWSPAPER_SENT_EVENT: Newspapers.Events.NewspaperSentEventType;
  NEWSPAPER_ARCHIVED_EVENT: Newspapers.Events.NewspaperArchivedEventType;
  NEWSPAPER_FAILED_EVENT: Newspapers.Events.NewspaperFailedEventType;
  ARBITRARY_FILE_SCHEDULED_EVENT: Files.Events.ArbitraryFileScheduledEventType;
  ARTICLES_TO_REVIEW_NOTIFICATIONS_DISABLED_EVENT: Settings.Events.ArticlesToReviewNotificationsDisabledEventType;
  ARTICLES_TO_REVIEW_NOTIFICATIONS_ENABLED_EVENT: Settings.Events.ArticlesToReviewNotificationsEnabledEventType;
  ARTICLES_TO_REVIEW_NOTIFICATION_HOUR_SET_EVENT: Settings.Events.ArticlesToReviewNotificationHourSetEventType;
  DELETE_OLD_ARTICLES_EVENT: Newspapers.Events.DeleteOldArticlesEventType;
}>({
  debug: {
    enabled: true,
    name: "infra/logger",
    logger: EventLogger.handle,
  },
});

emittery.on(
  Newspapers.Events.ARTICLE_ADDED_EVENT,
  EventHandler.handle(async (event) => {
    await Newspapers.Repos.ArticleRepository.create(event.payload);
    await Stats.Repos.StatsRepository.incrementCreatedArticles();
  })
);

emittery.on(
  Newspapers.Events.ARTICLE_DELETED_EVENT,
  EventHandler.handle(async (event) => {
    await Newspapers.Repos.ArticleRepository.updateStatus(
      event.payload.articleId,
      Newspapers.VO.ArticleStatusEnum.deleted
    );
  })
);

emittery.on(
  Newspapers.Events.ARTICLE_UNDELETE_EVENT,
  EventHandler.handle(async (event) => {
    await Newspapers.Repos.ArticleRepository.updateStatus(
      event.payload.articleId,
      Newspapers.VO.ArticleStatusEnum.ready
    );
  })
);

emittery.on(
  Newspapers.Events.ARTICLE_LOCKED_EVENT,
  EventHandler.handle(async (event) => {
    try {
      await Newspapers.Repos.ArticleRepository.updateStatus(
        event.payload.articleId,
        Newspapers.VO.ArticleStatusEnum.in_progress
      );

      await Newspapers.Repos.ArticleRepository.assignToNewspaper(
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
  Newspapers.Events.ARTICLE_UNLOCKED_EVENT,
  EventHandler.handle(async (event) => {
    await Newspapers.Repos.ArticleRepository.updateStatus(
      event.payload.articleId,
      Newspapers.VO.ArticleStatusEnum.ready
    );
  })
);

emittery.on(
  Newspapers.Events.ARTICLE_PROCESSED_EVENT,
  EventHandler.handle(async (event) => {
    await Newspapers.Repos.ArticleRepository.updateStatus(
      event.payload.articleId,
      Newspapers.VO.ArticleStatusEnum.processed
    );
  })
);

emittery.on(
  Newspapers.Events.NEWSPAPER_SCHEDULED_EVENT,
  EventHandler.handle(async (event) => {
    await Newspapers.Repos.NewspaperRepository.create({
      id: event.payload.id,
      scheduledAt: event.payload.createdAt,
      status: Newspapers.VO.NewspaperStatusEnum.scheduled,
    });

    for (const entity of event.payload.articles) {
      const article = await Newspapers.Aggregates.Article.build(entity.id);
      await article.lock(event.payload.id);
    }

    const newspaper = await new Newspapers.Aggregates.Newspaper(
      event.payload.id
    ).build();

    await newspaper.generate();
  })
);

emittery.on(
  Newspapers.Events.NEWSPAPER_GENERATED_EVENT,
  EventHandler.handle(async (event) => {
    await Newspapers.Repos.NewspaperRepository.updateStatus(
      event.payload.newspaperId,
      Newspapers.VO.NewspaperStatusEnum.ready_to_send
    );

    const newspaper = await new Newspapers.Aggregates.Newspaper(
      event.payload.newspaperId
    ).build();
    await newspaper.send();
  })
);

emittery.on(
  Newspapers.Events.NEWSPAPER_SENT_EVENT,
  EventHandler.handle(async (event) => {
    await Stats.Repos.StatsRepository.incrementSentNewspapers();

    await Newspapers.Repos.NewspaperRepository.updateStatus(
      event.payload.newspaperId,
      Newspapers.VO.NewspaperStatusEnum.delivered
    );

    await Newspapers.Repos.NewspaperRepository.updateSentAt(
      event.payload.newspaperId,
      event.payload.sentAt
    );

    for (const entity of event.payload.articles) {
      const article = await Newspapers.Aggregates.Article.build(entity.id);
      await article.markAsProcessed();
    }

    await Newspapers.Services.NewspaperFile.clear(event.payload.newspaperId);
  })
);

emittery.on(
  Newspapers.Events.NEWSPAPER_ARCHIVED_EVENT,
  EventHandler.handle(async (event) => {
    await Newspapers.Repos.NewspaperRepository.updateStatus(
      event.payload.newspaperId,
      Newspapers.VO.NewspaperStatusEnum.archived
    );
  })
);

emittery.on(
  Newspapers.Events.NEWSPAPER_FAILED_EVENT,
  EventHandler.handle(async (event) => {
    await Newspapers.Repos.NewspaperRepository.updateStatus(
      event.payload.newspaperId,
      Newspapers.VO.NewspaperStatusEnum.error
    );

    const newspaper = await new Newspapers.Aggregates.Newspaper(
      event.payload.newspaperId
    ).build();

    for (const item of newspaper.articles) {
      const article = await Newspapers.Aggregates.Article.build(item.id);
      await article.unlock();
    }
  })
);

emittery.on(
  Files.Events.ARBITRARY_FILE_SCHEDULED_EVENT,
  EventHandler.handle(async (event) => {
    const file = event.payload;

    try {
      await Files.Services.ArbitraryFileSender.send(file);

      infra.logger.info({
        message: "Mailer success",
        operation: "mailer_success",
        metadata: { filename: file.originalFilename },
      });

      await Files.Repos.FilesRepository.add(file);
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
  Newspapers.Events.DELETE_OLD_ARTICLES_EVENT,
  EventHandler.handle(async (event) => {
    const oldArticles = await Newspapers.Repos.ArticleRepository.getOld(
      event.payload.marker
    );

    if (!oldArticles.length) return;

    infra.logger.info({
      message: "Deleting old articles",
      operation: "old_articles_delete",
      metadata: { count: oldArticles.length },
    });

    for (const { id } of oldArticles) {
      const article = await Newspapers.Aggregates.Article.build(
        Newspapers.VO.ArticleId.parse(id)
      );
      await article.delete();
    }
  })
);
