import * as bg from "@bgord/node";

import * as Events from "../events";
import * as VO from "../value-objects";
import * as Repos from "../repositories";
import * as Policies from "../policies";

export class Settings {
  stream: bg.EventType["stream"];

  isArticlesToReviewNotificationEnabled = true;

  articlesToReviewNotificationHour: VO.HourType = VO.hour.parse(8);

  isFeedlyCrawlingStopped = false;

  constructor() {
    this.stream = Settings.getStream();
  }

  async build() {
    const events = await Repos.EventRepository.find(
      [
        Events.ArticlesToReviewNotificationsDisabledEvent,
        Events.ArticlesToReviewNotificationsEnabledEvent,
        Events.ArticlesToReviewNotificationHourSetEvent,
        Events.StopFeedlyCrawlingEvent,
        Events.RestoreFeedlyCrawlingEvent,
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

        case Events.STOP_FEEDLY_CRAWLING_EVENT:
          this.isFeedlyCrawlingStopped = true;
          break;

        case Events.RESTORE_FEEDLY_CRAWLING_EVENT:
          this.isFeedlyCrawlingStopped = false;
          break;

        default:
          continue;
      }
    }

    return this;
  }

  async disableArticlesToReviewNotification() {
    if (!this.isArticlesToReviewNotificationEnabled) return;

    await Repos.EventRepository.save(
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

    await Repos.EventRepository.save(
      Events.ArticlesToReviewNotificationsEnabledEvent.parse({
        name: Events.ARTICLES_TO_REVIEW_NOTIFICATIONS_ENABLED_EVENT,
        version: 1,
        stream: this.stream,
        payload: {},
      })
    );
  }

  async setArticlesToReviewNotificationHour(utcHour: VO.HourType) {
    if (!this.isArticlesToReviewNotificationEnabled) return;

    if (this.articlesToReviewNotificationHour === utcHour) return;

    await Repos.EventRepository.save(
      Events.ArticlesToReviewNotificationHourSetEvent.parse({
        name: Events.ARTICLES_TO_REVIEW_NOTIFICATION_HOUR_SET_EVENT,
        version: 1,
        stream: this.stream,
        payload: { hour: utcHour },
      })
    );
  }

  async stopFeedlyCrawling() {
    await Policies.StopFeedlyCrawling.perform({ settings: this });

    await Repos.EventRepository.save(
      Events.StopFeedlyCrawlingEvent.parse({
        name: Events.STOP_FEEDLY_CRAWLING_EVENT,
        version: 1,
        stream: this.stream,
        payload: {},
      })
    );
  }

  async restoreFeedlyCrawling() {
    await Policies.RestoreFeedlyCrawling.perform({ settings: this });

    await Repos.EventRepository.save(
      Events.RestoreFeedlyCrawlingEvent.parse({
        name: Events.RESTORE_FEEDLY_CRAWLING_EVENT,
        version: 1,
        stream: this.stream,
        payload: {},
      })
    );
  }

  static getStream() {
    return "settings";
  }
}
