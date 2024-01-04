import { h } from "preact";
import * as bg from "@bgord/frontend";

import * as UI from "./ui";
import * as types from "./types";

import { SettingsArticlesToReviewNotificationsSet } from "./settings-article-to-review-notifications-set";

import { SettingsArticlesToReviewNotificationsSwitch } from "./settings-articles-to-review-notifications-switch";

export function SettingsArticlesToReviewNotifications(
  props: types.SettingsType
) {
  const t = bg.useTranslations();

  return (
    <section
      data-display="flex"
      data-direction="column"
      data-gap="24"
      data-mt="12"
      data-pt="24"
      data-pb="12"
    >
      <SettingsArticlesToReviewNotificationsSwitch {...props} />
      <SettingsArticlesToReviewNotificationsSet {...props} />
      <UI.Info>
        {t("articles-to-review-notification.info", {
          local: bg.HourFormatter.convertUtcToLocal(
            props.articlesToReviewNotificationHour.raw
          ).label,
          utc_zero: props.articlesToReviewNotificationHour.formatted,
        })}
      </UI.Info>
    </section>
  );
}
