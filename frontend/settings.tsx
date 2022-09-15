import { h } from "preact";
import { useEffect } from "preact/hooks";
import { RoutableProps } from "preact-router";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";

import * as api from "./api";
import * as hooks from "./hooks";
import { SettingsType, HourType } from "./types";

export type InitialSettingsDataType = { settings: SettingsType };

export function Settings(props: RoutableProps) {
  hooks.useLeavingPrompt();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const settings = useQuery("settings", api.Settings.getSettings);

  const restoreFeedlyCrawling = useMutation(
    api.Settings.restoreFeedlyCrawling,
    {
      onSuccess: () => {
        notify({ message: "feedly.crawling.restored" });
        queryClient.invalidateQueries("settings");
      },
    }
  );
  const stopFeedlyCrawling = useMutation(api.Settings.stopFeedlyCrawling, {
    onSuccess: () => {
      notify({ message: "feedly.crawling.stopped" });
      queryClient.invalidateQueries("settings");
    },
  });

  if (!settings.isSuccess) return <div data-p="24">Preparing settings...</div>;

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
      data-mt="48"
      data-max-width="768"
      data-md-px="6"
    >
      <h2 data-fs="24" data-fw="400">
        Settings
      </h2>

      <section
        data-display="flex"
        data-direction="column"
        data-mt="48"
        data-md-mt="12"
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
            {isArticlesToReviewNotificationEnabled ? "Enabled" : "Disabled"}
          </strong>

          <h3 data-fs="16" data-md-fs="14" data-color="gray-600">
            Articles to review notifications
          </h3>

          {isArticlesToReviewNotificationEnabled && (
            <form
              method="POST"
              action="/disable-articles-to-review-notification"
              data-ml="12"
              data-md-ml="0"
            >
              <button type="submit" class="c-button" data-variant="primary">
                Disable
              </button>
            </form>
          )}

          {!isArticlesToReviewNotificationEnabled && (
            <form
              method="POST"
              action="/enable-articles-to-review-notification"
              data-ml="12"
              data-md-ml="0"
            >
              <button type="submit" class="c-button" data-variant="primary">
                Enable
              </button>
            </form>
          )}
        </div>

        <form
          method="POST"
          action="/set-articles-to-review-notification-hour"
          data-mt="36"
        >
          <label class="c-label" htmlFor="hour" data-mr="12">
            Hour (UTC)
          </label>
          <select id="hour" name="hour" class="c-select">
            {hours.map((option) => (
              <option
                value={option.value}
                selected={
                  option.value === articlesToReviewNotificationHour.value
                }
              >
                {option.label}
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
            Update
          </button>
        </form>

        <small data-fs="14" data-color="gray-400" data-mt="12">
          Notification will be sent at {articlesToReviewNotificationHour.label}{" "}
          UTC+0 every day, which is{" "}
          {formatUtcHourToLocal(articlesToReviewNotificationHour.value).label}{" "}
          your time.
        </small>
      </section>

      <section
        data-display="flex"
        data-direction="column"
        data-mt="24"
        data-pb="24"
        data-bwb="1"
        data-bcb="gray-200"
      >
        <div data-display="flex" data-cross="center">
          <strong
            data-transform="uppercase"
            data-color="gray-600"
            data-bg="gray-200"
            data-px="6"
            data-br="4"
            data-ls="1"
            data-fs="12"
            data-mr="12"
          >
            {isFeedlyCrawlingStopped ? "Stopped" : "Active"}
          </strong>

          <h3 data-fs="16" data-md-fs="14" data-color="gray-600" data-mr="36">
            Feedly crawling
          </h3>

          {isFeedlyCrawlingStopped && (
            <button
              type="submit"
              class="c-button"
              data-variant="primary"
              onClick={() => restoreFeedlyCrawling.mutate()}
            >
              Restore
            </button>
          )}

          {!isFeedlyCrawlingStopped && (
            <button
              type="submit"
              class="c-button"
              data-variant="primary"
              onClick={() => stopFeedlyCrawling.mutate()}
            >
              Stop
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

function formatUtcHourToLocal(hour: HourType) {
  const minutes = new bg.Time.Hours(hour).toMinutes();
  const timeZoneOffsetInMins = new Date().getTimezoneOffset();

  const localMinutes = minutes - timeZoneOffsetInMins;
  const localHour = localMinutes / 60;

  const formattedLocalHour = `${String(localHour).padStart(2, "0")}:00`;

  return { value: localHour, label: formattedLocalHour };
}
