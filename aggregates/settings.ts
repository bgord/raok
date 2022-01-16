import * as Events from "../events";

import { EventRepository } from "../repositories/event-repository";

export class Settings {
  stream: Events.StreamType;

  isArticlesToReviewNotificationEnabled: boolean = true;

  constructor() {
    this.stream = Settings.getStream();
  }

  async build() {
    const events = await EventRepository.find(
      [Events.ArticlesToReviewNotificationsDisabledEvent],
      this.stream
    );

    for (const event of events) {
      switch (event.name) {
        case Events.ARTICLES_TO_REVIEW_NOTIFICATIONS_DISABLED_EVENT:
          this.isArticlesToReviewNotificationEnabled = false;
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

  static getStream() {
    return "settings";
  }
}
