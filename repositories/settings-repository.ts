import * as VO from "../value-objects";
import { Settings } from "../aggregates/settings";

export class SettingsRepository {
  static async getAll() {
    const settings = await new Settings().build();

    return {
      hours: VO.Hour.listFormatted(),
      articlesToReviewNotificationHour: VO.Hour.format(
        settings.articlesToReviewNotificationHour
      ),
      isArticlesToReviewNotificationEnabled:
        settings.isArticlesToReviewNotificationEnabled,
      isFeedlyCrawlingStopped: settings.isFeedlyCrawlingStopped,
    };
  }
}
