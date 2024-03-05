import * as bg from "@bgord/node";
import Emittery from "emittery";

import * as Settings from "../modules/settings";
import * as Delivery from "../modules/delivery";
import * as NewspapersEvents from "../modules/newspapers/events";
import * as NewspapersHandlers from "../modules/newspapers/handlers";
import * as Recommendations from "../modules/recommendations";

import * as infra from "../infra";

const EventLogger = new bg.EventLogger(infra.logger);

export const emittery = new Emittery<{
  ARBITRARY_FILE_SCHEDULED_EVENT: Delivery.Events.ArbitraryFileScheduledEventType;
  ARTICLES_TO_REVIEW_NOTIFICATIONS_DISABLED_EVENT: Settings.Events.ArticlesToReviewNotificationsDisabledEventType;
  ARTICLES_TO_REVIEW_NOTIFICATIONS_ENABLED_EVENT: Settings.Events.ArticlesToReviewNotificationsEnabledEventType;
  ARTICLES_TO_REVIEW_NOTIFICATION_HOUR_SET_EVENT: Settings.Events.ArticlesToReviewNotificationHourSetEventType;
  ARTICLE_ADDED_EVENT: NewspapersEvents.ArticleAddedEventType;
  ARTICLE_DELETED_EVENT: NewspapersEvents.ArticleDeletedEventType;
  ARTICLE_LOCKED_EVENT: NewspapersEvents.ArticleLockedEventType;
  ARTICLE_PROCESSED_EVENT: NewspapersEvents.ArticleProcessedEventType;
  ARTICLE_READ_EVENT: NewspapersEvents.ArticleReadEventType;
  ARTICLE_UNDELETE_EVENT: NewspapersEvents.ArticleUndeleteEventType;
  ARTICLE_UNLOCKED_EVENT: NewspapersEvents.ArticleUnlockedEventType;
  ARTICLE_OPENED_EVENT: NewspapersEvents.ArticleOpenedEventType;
  ARTICLE_HOMEPAGE_OPENED_EVENT: NewspapersEvents.ArticleHomepageOpenedEventType;
  NEWSPAPER_ARCHIVED_EVENT: NewspapersEvents.NewspaperArchivedEventType;
  NEWSPAPER_FAILED_EVENT: NewspapersEvents.NewspaperFailedEventType;
  NEWSPAPER_GENERATED_EVENT: NewspapersEvents.NewspaperGenerateEventType;
  NEWSPAPER_SCHEDULED_EVENT: NewspapersEvents.NewspaperScheduledEventType;
  NEWSPAPER_SENT_EVENT: NewspapersEvents.NewspaperSentEventType;
}>({
  debug: { enabled: true, name: "infra/logger", logger: EventLogger.handle },
});

emittery.on(
  NewspapersEvents.ARTICLE_ADDED_EVENT,
  NewspapersHandlers.onArticleAddedEventHandler,
);

emittery.on(
  NewspapersEvents.ARTICLE_DELETED_EVENT,
  NewspapersHandlers.onArticleDeletedEventHandler,
);

emittery.on(
  NewspapersEvents.ARTICLE_READ_EVENT,
  NewspapersHandlers.onArticleReadEventHandler,
);

emittery.on(
  NewspapersEvents.ARTICLE_UNDELETE_EVENT,
  NewspapersHandlers.onArticleUndeletedEventHandler,
);

emittery.on(
  NewspapersEvents.ARTICLE_LOCKED_EVENT,
  NewspapersHandlers.onArticleLockedEventHandler,
);

emittery.on(
  NewspapersEvents.ARTICLE_UNLOCKED_EVENT,
  NewspapersHandlers.onArticleUnlockedEventHandler,
);

emittery.on(
  NewspapersEvents.ARTICLE_PROCESSED_EVENT,
  NewspapersHandlers.onArticleProcessedEventHandler,
);

emittery.on(
  NewspapersEvents.ARTICLE_OPENED_EVENT,
  NewspapersHandlers.onArticleOpenedEventHandler,
);

emittery.on(
  NewspapersEvents.NEWSPAPER_SCHEDULED_EVENT,
  NewspapersHandlers.onNewspaperScheduledEventHandler,
);

emittery.on(
  NewspapersEvents.NEWSPAPER_GENERATED_EVENT,
  NewspapersHandlers.onNewspaperGeneratedEventHandler,
);

emittery.on(
  NewspapersEvents.NEWSPAPER_SENT_EVENT,
  NewspapersHandlers.onNewspaperSentEventHandler,
);

emittery.on(
  NewspapersEvents.NEWSPAPER_ARCHIVED_EVENT,
  NewspapersHandlers.onNewspaperArchivedEventHandler,
);

emittery.on(
  NewspapersEvents.NEWSPAPER_FAILED_EVENT,
  NewspapersHandlers.onNewspaperFailedEventHandler,
);

emittery.on(
  Delivery.Events.ARBITRARY_FILE_SCHEDULED_EVENT,
  Delivery.Handlers.onArbitraryFileScheduledEventHandler,
);

// Recommendations

emittery.on(
  NewspapersEvents.ARTICLE_ADDED_EVENT,
  Recommendations.Handlers.onArticleAddedEventHandler,
);

emittery.on(
  NewspapersEvents.ARTICLE_OPENED_EVENT,
  Recommendations.Handlers.onArticleOpenedEventHandler,
);

emittery.on(
  NewspapersEvents.ARTICLE_PROCESSED_EVENT,
  Recommendations.Handlers.onArticleProcessedEventHandler,
);

emittery.on(
  NewspapersEvents.ARTICLE_DELETED_EVENT,
  Recommendations.Handlers.onArticleDeletedEventHandler,
);

emittery.on(
  NewspapersEvents.ARTICLE_READ_EVENT,
  Recommendations.Handlers.onArticleReadEventHandler,
);

emittery.on(
  NewspapersEvents.ARTICLE_HOMEPAGE_OPENED_EVENT,
  Recommendations.Handlers.onArticleHomepageOpenedEventHandler,
);
