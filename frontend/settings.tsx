import { h } from "preact";
import { RoutableProps } from "preact-router";
import { useQuery } from "react-query";
import * as bg from "@bgord/frontend";

import * as api from "./api";
import * as hooks from "./hooks";
import * as types from "./types";

export type InitialSettingsDataType = { settings: types.SettingsType };

import { SettingsArticlesToReviewNotifications } from "./settings-articles-to-review-notifications";

export function Settings(_props: RoutableProps) {
  hooks.useLeavingPrompt();

  const t = bg.useTranslations();

  const settings = useQuery(api.keys.settings, api.Settings.getSettings);

  if (!settings.isSuccess)
    return <div data-p="24">{t("settings.preparing")}</div>;

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

      <SettingsArticlesToReviewNotifications {...settings.data} />
    </main>
  );
}
