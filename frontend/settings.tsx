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

  const restoreFeedlyCrawling = useMutation(
    api.Settings.restoreFeedlyCrawling,
    {
      onSuccess: () => {
        notify({ message: "dashboard.crawling.restored" });
        queryClient.invalidateQueries("settings");
      },
    }
  );
  const stopFeedlyCrawling = useMutation(api.Settings.stopFeedlyCrawling, {
    onSuccess: () => {
      notify({ message: "dashboard.crawling.stopped" });
      queryClient.invalidateQueries("settings");
    },
  });

  const enableArticlesToReviewNotification = useMutation(
    api.Settings.enableArticlesToReviewNotification,
    {
      onSuccess: () => {
        notify({ message: "articles-to-review-notification.enabled" });
        queryClient.invalidateQueries("settings");
      },
    }
  );
  const disableArticlesToReviewNotification = useMutation(
    api.Settings.disableArticlesToReviewNotification,
    {
      onSuccess: () => {
        notify({ message: "articles-to-review-notification.disabled" });
        queryClient.invalidateQueries("settings");
      },
    }
  );

  const setArticlesToReviewNotificationHour = useMutation(
    api.Settings.setArticlesToReviewNotificationHour,
    {
      onSuccess: () => {
        notify({ message: "articles-to-review-notification.hour.changed" });
        queryClient.invalidateQueries("settings");
      },
    }
  );

  if (!settings.isSuccess)
    return <div data-p="24">{t("settings.preparing")}</div>;

  const {
    isArticlesToReviewNotificationEnabled,
    hours,
    articlesToReviewNotificationHour,
    isFeedlyCrawlingStopped,
  } = settings.data;

  return (
    <main
      data-display="flex"
      data-direction="column"
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
        data-mt="12"
        data-pb="24"
        data-bwb="1"
        data-bcb="gray-200"
      >
        <div data-display="flex" data-cross="center" data-gap="12" data-mt="24">
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
            data-mr="12"
            data-transform="upper-first"
          >
            {t("articles-to-review-notification")}
          </div>

          {isArticlesToReviewNotificationEnabled && (
            <button
              type="submit"
              class="c-button"
              data-variant="primary"
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
              onClick={() => enableArticlesToReviewNotification.mutate()}
            >
              {t("app.enable")}
            </button>
          )}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();

            const form = new FormData(event.target as HTMLFormElement);
            const hour = Number(form.get("hour"));

            setArticlesToReviewNotificationHour.mutate(hour);
          }}
          data-mt="36"
        >
          <label class="c-label" htmlFor="hour" data-mr="12">
            {t("app.hour")}
          </label>
          <select
            id="hour"
            name="hour"
            class="c-select"
            disabled={!isArticlesToReviewNotificationEnabled}
          >
            {hours
              .map((hour) => ({
                ...hour,
                local: formatUtcHourToLocal(hour.value).label,
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
            disabled={!isArticlesToReviewNotificationEnabled}
            type="submit"
            class="c-button"
            data-variant="secondary"
            data-ml="24"
          >
            {t("app.update")}
          </button>
        </form>

        <UI.Info data-mt="24">
          {t("articles-to-review-notification.info", {
            local: formatUtcHourToLocal(articlesToReviewNotificationHour.value)
              .label,
            utc_zero: articlesToReviewNotificationHour.label,
          })}
        </UI.Info>
      </section>

      <section
        data-display="flex"
        data-cross="center"
        data-gap="24"
        data-mt="24"
        data-pb="24"
        data-bwb="1"
        data-bcb="gray-200"
      >
        <strong
          data-transform="uppercase"
          data-color="gray-600"
          data-bg="gray-200"
          data-px="6"
          data-br="4"
          data-ls="1"
          data-fs="12"
        >
          {isFeedlyCrawlingStopped ? t("app.stopped") : t("app.active")}
        </strong>

        <div
          data-fs="14"
          data-color="gray-600"
          data-mr="12"
          data-transform="upper-first"
        >
          {t("dashboard.crawling")}
        </div>

        {isFeedlyCrawlingStopped && (
          <button
            type="submit"
            class="c-button"
            data-variant="primary"
            onClick={() => restoreFeedlyCrawling.mutate()}
          >
            {t("app.restore")}
          </button>
        )}

        {!isFeedlyCrawlingStopped && (
          <button
            type="submit"
            class="c-button"
            data-variant="primary"
            onClick={() => stopFeedlyCrawling.mutate()}
          >
            {t("app.stop")}
          </button>
        )}
      </section>
    </main>
  );
}

function formatUtcHourToLocal(hour: types.HourType) {
  const minutes = new bg.Time.Hours(hour).toMinutes();
  const timeZoneOffsetInMins = new Date().getTimezoneOffset();

  const localMinutes = minutes - timeZoneOffsetInMins;

  const localHour = (localMinutes / 60) % 24;

  const formattedLocalHour = `${String(localHour).padStart(2, "0")}:00`;

  return { value: localHour, label: formattedLocalHour };
}
