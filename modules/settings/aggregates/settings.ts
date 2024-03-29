import * as bg from "@bgord/node";

import * as Events from "../events";
import * as Policies from "../policies";

import * as infra from "../../../infra";

export class Settings {
  private readonly stream: bg.EventType["stream"];

  isArticlesToReviewNotificationEnabled = true;

  articlesToReviewNotificationHour: bg.Schema.HourType =
    bg.Schema.Hour.parse(8);

  constructor() {
    this.stream = Settings.getStream();
  }

  async build() {
    const events = await infra.EventStore.find(
      [
        Events.ArticlesToReviewNotificationsDisabledEvent,
        Events.ArticlesToReviewNotificationsEnabledEvent,
        Events.ArticlesToReviewNotificationHourSetEvent,
      ],
      this.stream
    );

    for (const event of events) {
      switch (event.name) {
        case Events.ARTICLES_TO_REVIEW_NOTIFICATIONS_DISABLED_EVENT:
          this.isArticlesToReviewNotificationEnabled = false;
          break;

        case Events.ARTICLES_TO_REVIEW_NOTIFICATIONS_ENABLED_EVENT:
          this.isArticlesToReviewNotificationEnabled = true;
          break;

        case Events.ARTICLES_TO_REVIEW_NOTIFICATION_HOUR_SET_EVENT:
          this.articlesToReviewNotificationHour = event.payload.hour;
          break;

        default:
          continue;
      }
    }

    return this;
  }

  async disableArticlesToReviewNotification() {
    if (!this.isArticlesToReviewNotificationEnabled) return;

    await infra.EventStore.save(
      Events.ArticlesToReviewNotificationsDisabledEvent.parse({
        name: Events.ARTICLES_TO_REVIEW_NOTIFICATIONS_DISABLED_EVENT,
        version: 1,
        stream: this.stream,
        payload: {},
      } satisfies Events.ArticlesToReviewNotificationsDisabledEventType)
    );
  }

  async enableArticlesToReviewNotification() {
    if (this.isArticlesToReviewNotificationEnabled) return;

    await infra.EventStore.save(
      Events.ArticlesToReviewNotificationsEnabledEvent.parse({
        name: Events.ARTICLES_TO_REVIEW_NOTIFICATIONS_ENABLED_EVENT,
        version: 1,
        stream: this.stream,
        payload: {},
      } satisfies Events.ArticlesToReviewNotificationsEnabledEventType)
    );
  }

  async setArticlesToReviewNotificationHour(utcHour: bg.Schema.HourType) {
    if (!this.isArticlesToReviewNotificationEnabled) return;

    await Policies.NotificationHourShouldChange.perform({
      current: this.articlesToReviewNotificationHour,
      changed: utcHour,
    });

    await infra.EventStore.save(
      Events.ArticlesToReviewNotificationHourSetEvent.parse({
        name: Events.ARTICLES_TO_REVIEW_NOTIFICATION_HOUR_SET_EVENT,
        version: 1,
        stream: this.stream,
        payload: { hour: utcHour },
      } satisfies Events.ArticlesToReviewNotificationHourSetEventType)
    );
  }

  static getStream() {
    return "settings";
  }
}
