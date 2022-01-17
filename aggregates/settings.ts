import * as Events from "../events";

import * as VO from "../value-objects";
import { EventRepository } from "../repositories/event-repository";

export class Settings {
  stream: Events.StreamType;

  isArticlesToReviewNotificationEnabled: boolean = true;
  articlesToReviewNotificationHour: VO.HourType = VO.hour.parse(8);

  constructor() {
    this.stream = Settings.getStream();
  }

  async build() {
    const events = await EventRepository.find(
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

    await EventRepository.save(
      Events.ArticlesToReviewNotificationsDisabledEvent.parse({
        name: Events.ARTICLES_TO_REVIEW_NOTIFICATIONS_DISABLED_EVENT,
        version: 1,
        stream: this.stream,
        payload: {},
      })
    );
  }

  async enableArticlesToReviewNotification() {
    if (this.isArticlesToReviewNotificationEnabled) return;

    await EventRepository.save(
      Events.ArticlesToReviewNotificationsEnabledEvent.parse({
        name: Events.ARTICLES_TO_REVIEW_NOTIFICATIONS_ENABLED_EVENT,
        version: 1,
        stream: this.stream,
        payload: {},
      })
    );
  }

  async setArticlesToReviewNotificationHour(hour: VO.HourType) {
    if (!this.isArticlesToReviewNotificationEnabled) return;

    if (this.articlesToReviewNotificationHour === hour) return;

    await EventRepository.save(
      Events.ArticlesToReviewNotificationHourSetEvent.parse({
        name: Events.ARTICLES_TO_REVIEW_NOTIFICATION_HOUR_SET_EVENT,
        version: 1,
        stream: this.stream,
        payload: { hour },
      })
    );
  }

  static getStream() {
    return "settings";
  }
}
