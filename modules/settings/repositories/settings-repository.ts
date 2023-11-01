import * as VO from "../../../value-objects";
import * as Aggregates from "../aggregates";

export class SettingsRepository {
  static async getAll() {
    const settings = await new Aggregates.Settings().build();

    return {
      hours: VO.Hour.listFormatted(),
      articlesToReviewNotificationHour: VO.Hour.format(
        settings.articlesToReviewNotificationHour
      ),
      isArticlesToReviewNotificationEnabled:
        settings.isArticlesToReviewNotificationEnabled,
    };
  }
}
