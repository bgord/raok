import { h } from "preact";
import { RoutableProps } from "preact-router";
import { useQuery } from "react-query";

import { api } from "./api";
import { SettingsType } from "./types";

export type InitialSettingsDataType = {
  settings: SettingsType;
};

export function Settings(props: RoutableProps & InitialSettingsDataType) {
  const settings = useQuery("settings", api.getSettings, {
    initialData: props.settings,
  });

  return (
    <main
      data-display="flex"
      data-direction="column"
      data-mx="auto"
      data-mt="48"
      data-max-width="768"
    >
      <h2 data-fs="24" data-fw="400">
        Settings
      </h2>

      <section
        data-display="flex"
        data-direction="column"
        data-mt="48"
        data-pb="24"
        data-bwb="1"
        data-bcb="gray-200"
      >
        <div data-display="flex" data-cross="center" data-mt="24">
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
            {settings.data?.isArticlesToReviewNotificationEnabled
              ? "Enabled"
              : "Disabled"}
          </strong>

          <h3 data-fs="16" data-color="gray-600" data-mr="36">
            Articles to review notifications
          </h3>

          {settings.data?.isArticlesToReviewNotificationEnabled && (
            <form
              method="POST"
              action="/disable-articles-to-review-notification"
            >
              <button type="submit" class="c-button" data-variant="primary">
                Disable
              </button>
            </form>
          )}

          {!settings.data?.isArticlesToReviewNotificationEnabled && (
            <form
              method="POST"
              action="/enable-articles-to-review-notification"
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
          <label class="c-label" for="hour" data-mr="12">
            Hour
          </label>
          <select id="hour" name="hour" class="c-select">
            {settings.data?.hours.map((option) => (
              <option
                value={option.value}
                selected={
                  option.value ===
                  settings.data?.articlesToReviewNotificationHour.value
                }
              >
                {option.label}
              </option>
            ))}
          </select>
          <button
            disabled={!settings.data?.isArticlesToReviewNotificationEnabled}
            type="submit"
            class="c-button"
            data-variant="secondary"
            data-ml="24"
          >
            Update
          </button>
        </form>

        <small data-fs="14" data-color="gray-400" data-mt="24">
          Notification will be sent at{" "}
          {settings.data?.articlesToReviewNotificationHour.label} UTC+0 every
          day.
        </small>
      </section>
    </main>
  );
}
