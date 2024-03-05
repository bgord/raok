import { h } from "preact";
import { useQuery } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as UI from "./ui";
import * as api from "./api";
import * as hooks from "./hooks";

import { SettingsDevice } from "./settings-device";
import { DeviceCreate } from "./settings-device-create";

export function SettingsDevices() {
  hooks.useLeavingPrompt();

  const t = bg.useTranslations();
  const actions = bg.usePersistentToggle("settings-devices-enabled", false);

  const deviceList = useQuery(api.keys.allDevices, api.Devices.list);
  const devices = deviceList.data ?? [];

  return (
    <section
      data-display="flex"
      data-direction="column"
      data-mt="24"
      data-mx="auto"
      data-max-width="768"
      data-md-max-width="100%"
      data-width="100%"
    >
      <div data-display="flex" data-gap="12" data-cross="center">
        <UI.Badge>{devices.length}</UI.Badge>
        <div data-fs="14" data-color="gray-600">
          {t("settings.device_list")}
        </div>

        <button
          type="button"
          class="c-button"
          data-variant="with-icon"
          data-ml="auto"
          onClick={actions.toggle}
          title={
            actions.on ? t("article.actions.hide") : t("article.actions.show")
          }
          {...actions.props.controller}
        >
          {actions.off && <Icons.NavArrowLeft height="20" width="20" />}
          {actions.on && <Icons.NavArrowDown height="20" width="20" />}
        </button>
      </div>

      {actions.on && <DeviceCreate />}

      {actions.on && (
        <ul
          data-display="flex"
          data-direction="column"
          data-gap="12"
          data-my="24"
          data-max-width="100%"
        >
          {devices.map((device, index) => (
            <SettingsDevice
              key={device.id}
              index={index}
              numberOfDevices={devices.length}
              {...device}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
