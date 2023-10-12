import { h } from "preact";
import { RoutableProps } from "preact-router";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";

import * as UI from "./ui";
import * as api from "./api";
import * as hooks from "./hooks";
import * as types from "./types";

export type InitialSettingsDataType = { settings: types.SettingsType };

export function Settings(_props: RoutableProps) {
  hooks.useLeavingPrompt();

  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const settings = useQuery("settings", api.Settings.getSettings);

  const notificationHour = bg.useField<types.HourType | undefined>(
    "notification-hour",
    settings.data?.articlesToReviewNotificationHour.value
  );

  const notificationHourChangeDisabled: boolean =
    !settings.data?.isArticlesToReviewNotificationEnabled ||
    notificationHour.value ===
      settings.data.articlesToReviewNotificationHour.value;

  const enableArticlesToReviewNotification = useMutation(
    api.Settings.enableArticlesToReviewNotification,
    {
      onSuccess: () => {
        notify({ message: "articles-to-review-notification.enabled" });
        queryClient.invalidateQueries("settings");
      },
      onError: (error: bg.ServerError) => notify({ message: error.message }),
    }
  );
  const disableArticlesToReviewNotification = useMutation(
    api.Settings.disableArticlesToReviewNotification,
    {
      onSuccess: () => {
        notify({ message: "articles-to-review-notification.disabled" });
        queryClient.invalidateQueries("settings");
      },
      onError: (error: bg.ServerError) => notify({ message: error.message }),
    }
  );

  const setArticlesToReviewNotificationHour = useMutation(
    api.Settings.setArticlesToReviewNotificationHour,
    {
      onSuccess: () => {
        notify({ message: "articles-to-review-notification.hour.changed" });
        queryClient.invalidateQueries("settings");
      },
      onError: (error: bg.ServerError) => notify({ message: error.message }),
    }
  );

  if (!settings.isSuccess)
    return <div data-p="24">{t("settings.preparing")}</div>;

  const {
    isArticlesToReviewNotificationEnabled,
    hours,
    articlesToReviewNotificationHour,
  } = settings.data;

  return (
    <main
      data-display="flex"
      data-direction="column"
      data-gap="12"
      data-mx="auto"
      data-mt="24"
      data-max-width="768"
      data-md-px="6"
    >
      <h2 data-fs="20" data-color="gray-800" data-fw="500">
        {t("app.settings")}
      </h2>

      <section
        data-display="flex"
        data-direction="column"
        data-gap="24"
        data-mt="12"
        data-bwb="1"
        data-bcb="gray-200"
        data-py="24"
      >
        <div data-display="flex" data-cross="center" data-gap="12">
          <div data-display="flex" data-wrap="nowrap" data-gap="12">
            <strong
              data-px="6"
              data-transform="uppercase"
              data-color="gray-600"
              data-bg="gray-200"
              data-br="4"
              data-ls="1"
              data-fs="12"
            >
              {isArticlesToReviewNotificationEnabled
                ? t("app.enabled")
                : t("app.disabled")}
            </strong>

            <div
              data-fs="14"
              data-color="gray-600"
              data-transform="upper-first"
            >
              {t("articles-to-review-notification")}
            </div>
          </div>

          {isArticlesToReviewNotificationEnabled && (
            <button
              type="submit"
              class="c-button"
              data-variant="primary"
              data-ml="auto"
              onClick={() => disableArticlesToReviewNotification.mutate()}
            >
              {t("app.disable")}
            </button>
          )}

          {!isArticlesToReviewNotificationEnabled && (
            <button
              type="submit"
              class="c-button"
              data-variant="primary"
              data-ml="auto"
              onClick={() => enableArticlesToReviewNotification.mutate()}
            >
              {t("app.enable")}
            </button>
          )}
        </div>

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
          >
            {hours
              .map((hour) => ({
                ...hour,
                local: bg.HourFormatter.convertUtcToLocal(hour.value).label,
              }))
              .sort((a, b) => (a.local > b.local ? 1 : -1))
              .map((option) => (
                <option
                  value={option.value}
                  selected={
                    option.value === articlesToReviewNotificationHour.value
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
        </form>

        <UI.Info>
          {t("articles-to-review-notification.info", {
            local: bg.HourFormatter.convertUtcToLocal(
              articlesToReviewNotificationHour.value
            ).label,
            utc_zero: articlesToReviewNotificationHour.label,
          })}
        </UI.Info>
      </section>
    </main>
  );
}
