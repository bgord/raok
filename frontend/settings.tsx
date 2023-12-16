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

  const settings = useQuery(api.keys.settings, api.Settings.getSettings);

  const notificationHour = bg.useField<types.HourType | undefined>(
    "notification-hour",
    settings.data?.articlesToReviewNotificationHour.raw
  );

  const articlesToReviewNotificationEnabled = bg.useField<boolean>(
    "articles-to-review-notification-enabled",
    settings.data?.isArticlesToReviewNotificationEnabled ?? false
  );

  const notificationHourChangeDisabled: boolean =
    !settings.data?.isArticlesToReviewNotificationEnabled ||
    notificationHour.value ===
      settings.data.articlesToReviewNotificationHour.raw;

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

  if (!settings.isSuccess)
    return <div data-p="24">{t("settings.preparing")}</div>;

  const { hours, articlesToReviewNotificationHour } = settings.data;

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

            {settings.data?.isArticlesToReviewNotificationEnabled && (
              <div
                class="c-badge"
                data-color="green-700"
                data-bg="green-100"
                {...bg.Rhythm().times(7).style.width}
              >
                {t("articles-to-review-notification.enabled")}
              </div>
            )}

            {!settings.data?.isArticlesToReviewNotificationEnabled && (
              <div class="c-badge" {...bg.Rhythm().times(7).style.width}>
                {t("articles-to-review-notification.disabled")}
              </div>
            )}

            <div
              data-fs="14"
              data-color="gray-600"
              data-transform="upper-first"
            >
              {t("articles-to-review-notification")}
            </div>
          </div>
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
            value={notificationHour.value}
          >
            {hours
              .map((hour) => ({
                ...hour,
                local: bg.HourFormatter.convertUtcToLocal(hour.raw).label,
              }))
              .toSorted((a, b) => (a.local > b.local ? 1 : -1))
              .map((option) => (
                <option
                  key={option.raw}
                  value={option.raw}
                  selected={option.raw === articlesToReviewNotificationHour.raw}
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

        <UI.Info>
          {t("articles-to-review-notification.info", {
            local: bg.HourFormatter.convertUtcToLocal(
              articlesToReviewNotificationHour.raw
            ).label,
            utc_zero: articlesToReviewNotificationHour.formatted,
          })}
        </UI.Info>
      </section>
    </main>
  );
}
