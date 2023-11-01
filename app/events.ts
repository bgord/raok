import * as bg from "@bgord/node";
import Emittery from "emittery";

import * as Settings from "../modules/settings";
import * as Files from "../modules/files";
import * as NewspapersEvents from "../modules/newspapers/events";
import * as NewspapersHandlers from "../modules/newspapers/handlers";

import * as infra from "../infra";

const EventLogger = new bg.EventLogger(infra.logger);

export const emittery = new Emittery<{
  ARTICLE_ADDED_EVENT: NewspapersEvents.ArticleAddedEventType;
  ARTICLE_DELETED_EVENT: NewspapersEvents.ArticleDeletedEventType;
  ARTICLE_LOCKED_EVENT: NewspapersEvents.ArticleLockedEventType;
  ARTICLE_UNLOCKED_EVENT: NewspapersEvents.ArticleUnlockedEventType;
  ARTICLE_PROCESSED_EVENT: NewspapersEvents.ArticleProcessedEventType;
  ARTICLE_UNDELETE_EVENT: NewspapersEvents.ArticleUndeleteEventType;
  NEWSPAPER_SCHEDULED_EVENT: NewspapersEvents.NewspaperScheduledEventType;
  NEWSPAPER_GENERATED_EVENT: NewspapersEvents.NewspaperGenerateEventType;
  NEWSPAPER_SENT_EVENT: NewspapersEvents.NewspaperSentEventType;
  NEWSPAPER_ARCHIVED_EVENT: NewspapersEvents.NewspaperArchivedEventType;
  NEWSPAPER_FAILED_EVENT: NewspapersEvents.NewspaperFailedEventType;
  ARBITRARY_FILE_SCHEDULED_EVENT: Files.Events.ArbitraryFileScheduledEventType;
  ARTICLES_TO_REVIEW_NOTIFICATIONS_DISABLED_EVENT: Settings.Events.ArticlesToReviewNotificationsDisabledEventType;
  ARTICLES_TO_REVIEW_NOTIFICATIONS_ENABLED_EVENT: Settings.Events.ArticlesToReviewNotificationsEnabledEventType;
  ARTICLES_TO_REVIEW_NOTIFICATION_HOUR_SET_EVENT: Settings.Events.ArticlesToReviewNotificationHourSetEventType;
  DELETE_OLD_ARTICLES_EVENT: NewspapersEvents.DeleteOldArticlesEventType;
}>({
  debug: {
    enabled: true,
    name: "infra/logger",
    logger: EventLogger.handle,
  },
});

emittery.on(
  NewspapersEvents.ARTICLE_ADDED_EVENT,
  NewspapersHandlers.onArticleAddedEventHandler
);

emittery.on(
  NewspapersEvents.ARTICLE_DELETED_EVENT,
  NewspapersHandlers.onArticleDeletedEventHandler
);

emittery.on(
  NewspapersEvents.ARTICLE_UNDELETE_EVENT,
  NewspapersHandlers.onArticleUndeletedEventHandler
);

emittery.on(
  NewspapersEvents.ARTICLE_LOCKED_EVENT,
  NewspapersHandlers.onArticleLockedEventHandler
);

emittery.on(
  NewspapersEvents.ARTICLE_UNLOCKED_EVENT,
  NewspapersHandlers.onArticleUnlockedEventHandler
);

emittery.on(
  NewspapersEvents.ARTICLE_PROCESSED_EVENT,
  NewspapersHandlers.onArticleProcessedEventHandler
);

emittery.on(
  NewspapersEvents.NEWSPAPER_SCHEDULED_EVENT,
  NewspapersHandlers.onNewspaperScheduledEventHandler
);

emittery.on(
  NewspapersEvents.NEWSPAPER_GENERATED_EVENT,
  NewspapersHandlers.onNewspaperGeneratedEventHandler
);

emittery.on(
  NewspapersEvents.NEWSPAPER_SENT_EVENT,
  NewspapersHandlers.onNewspaperSentEventHandler
);

emittery.on(
  NewspapersEvents.NEWSPAPER_ARCHIVED_EVENT,
  NewspapersHandlers.onNewspaperArchivedEventHandler
);

emittery.on(
  NewspapersEvents.NEWSPAPER_FAILED_EVENT,
  NewspapersHandlers.onNewspaperFailedEventHandler
);

emittery.on(
  Files.Events.ARBITRARY_FILE_SCHEDULED_EVENT,
  Files.Handlers.onArbitraryFileScheduledEventHandler
);

emittery.on(
  NewspapersEvents.DELETE_OLD_ARTICLES_EVENT,
  NewspapersHandlers.onDeleteOldArticlesEventHandler
);
