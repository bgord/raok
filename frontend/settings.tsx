import { h } from "preact";
import { RoutableProps } from "preact-router";
import * as bg from "@bgord/frontend";

import * as hooks from "./hooks";

import { SettingsTokenBlacklist } from "./settings-token-blacklist";
import { SettingsDevices } from "./settings-devices";

export function Settings(_props: RoutableProps) {
  hooks.useLeavingPrompt();

  const t = bg.useTranslations();

  return (
    <main
      data-display="flex"
      data-direction="column"
      data-gap="12"
      data-mx="auto"
      data-mt="24"
      data-max-width="768"
      data-md-px="6"
      data-md-mb="48"
    >
      <h2 data-fs="20" data-color="gray-800" data-fw="500">
        {t("app.settings")}
      </h2>

      <SettingsDevices />
      <SettingsTokenBlacklist />
    </main>
  );
}
