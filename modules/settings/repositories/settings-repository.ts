import * as bg from "@bgord/node";

import * as Aggregates from "../aggregates";

export class SettingsRepository {
  static async getAll() {
    const {
      isArticlesToReviewNotificationEnabled,
      articlesToReviewNotificationHour,
    } = await new Aggregates.Settings().build();

    return {
      hours: bg.Hour.list().map((hour) => hour.get()),

      articlesToReviewNotificationHour: new bg.Hour(
        articlesToReviewNotificationHour
      ).get(),

      isArticlesToReviewNotificationEnabled,
    };
  }
}
