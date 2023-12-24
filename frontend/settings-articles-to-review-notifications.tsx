import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";

import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";

import { SettingsArticlesToReviewNotificationsSet } from "./settings-article-to-review-notifications-set";

export function SettingsArticlesToReviewNotifications(
  props: types.SettingsType
) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const articlesToReviewNotificationEnabled = bg.useField<boolean>(
    "articles-to-review-notification-enabled",
    props.isArticlesToReviewNotificationEnabled ?? false
  );

  const enableArticlesToReviewNotification = useMutation(
    api.Settings.enableArticlesToReviewNotification,
    {
      onSuccess: () => {
        notify({ message: "articles-to-review-notification.enabled" });
        queryClient.invalidateQueries(api.keys.settings);
      },
      onError: (error: bg.ServerError) => notify({ message: error.message }),
    }
  );
  const disableArticlesToReviewNotification = useMutation(
    api.Settings.disableArticlesToReviewNotification,
    {
      onSuccess: () => {
        notify({ message: "articles-to-review-notification.disabled" });
        queryClient.invalidateQueries(api.keys.settings);
      },
      onError: (error: bg.ServerError) => notify({ message: error.message }),
    }
  );

  return (
    <section
      data-display="flex"
      data-direction="column"
      data-gap="24"
      data-mt="12"
      data-py="24"
    >
      <div data-display="flex" data-cross="center" data-gap="12">
        <div data-display="flex" data-wrap="nowrap" data-gap="12">
          <bg.Switch
            {...articlesToReviewNotificationEnabled}
            onChange={(event: h.JSX.TargetedUIEvent<HTMLInputElement>) =>
              event.currentTarget.checked
                ? enableArticlesToReviewNotification.mutate()
                : disableArticlesToReviewNotification.mutate()
            }
          />

          {props.isArticlesToReviewNotificationEnabled && (
            <div
              class="c-badge"
              data-color="green-700"
              data-bg="green-100"
              {...bg.Rhythm().times(7).style.width}
            >
              {t("articles-to-review-notification.enabled")}
            </div>
          )}

          {props.isArticlesToReviewNotificationEnabled && (
            <div class="c-badge" {...bg.Rhythm().times(7).style.width}>
              {t("articles-to-review-notification.disabled")}
            </div>
          )}

          <div data-fs="14" data-color="gray-600" data-transform="upper-first">
            {t("articles-to-review-notification")}
          </div>
        </div>
      </div>

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
