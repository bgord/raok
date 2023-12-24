import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";

import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";

export function SettingsArticlesToReviewNotificationsSet(
  props: types.SettingsType
) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const notificationHour = bg.useField<types.HourType | undefined>(
    "notification-hour",
    props.articlesToReviewNotificationHour.raw
  );

  const notificationHourChangeDisabled: boolean =
    !props.isArticlesToReviewNotificationEnabled ||
    notificationHour.value === props.articlesToReviewNotificationHour.raw;

  const setArticlesToReviewNotificationHour = useMutation(
    api.Settings.setArticlesToReviewNotificationHour,
    {
      onSuccess: () => {
        notify({ message: "articles-to-review-notification.hour.changed" });
        queryClient.invalidateQueries(api.keys.settings);
      },
      onError: (error: bg.ServerError) => notify({ message: error.message }),
    }
  );

  return (
    <form
      data-display="flex"
      data-cross="center"
      data-gap="12"
      onSubmit={(event) => {
        event.preventDefault();

        setArticlesToReviewNotificationHour.mutate(
          Number(notificationHour.value)
        );
      }}
    >
      <label class="c-label" htmlFor="hour">
        {t("app.hour")}
      </label>

      <select
        id="hour"
        name="hour"
        class="c-select"
        onInput={(event) =>
          notificationHour.set(Number(event.currentTarget.value))
        }
        value={notificationHour.value}
        disabled={!props.isArticlesToReviewNotificationEnabled}
      >
        {props.hours
          .map((hour) => ({
            ...hour,
            local: bg.HourFormatter.convertUtcToLocal(hour.raw).label,
          }))
          .toSorted((a, b) => (a.local > b.local ? 1 : -1))
          .map((option) => (
            <option
              key={option.raw}
              value={option.raw}
              selected={
                option.raw === props.articlesToReviewNotificationHour.raw
              }
            >
              {option.local}
            </option>
          ))}
      </select>
      <button
        disabled={notificationHourChangeDisabled}
        type="submit"
        class="c-button"
        data-variant="secondary"
        data-ml="12"
      >
        {t("app.update")}
      </button>

      <UI.ClearButton
        disabled={
          notificationHour.unchanged ||
          setArticlesToReviewNotificationHour.isLoading
        }
        onClick={notificationHour.clear}
      />
    </form>
  );
}
