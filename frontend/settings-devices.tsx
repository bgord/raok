import { h } from "preact";
import { useQuery } from "react-query";
import * as bg from "@bgord/frontend";

import * as UI from "./ui";
import * as api from "./api";
import * as hooks from "./hooks";

import { SettingsDevice } from "./settings-device";
import { DeviceCreate } from "./settings-device-create";

export function SettingsDevices() {
  hooks.useLeavingPrompt();

  const t = bg.useTranslations();

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
      </div>

      <DeviceCreate />

      <ul
        data-display="flex"
        data-direction="column"
        data-gap="12"
        data-my="24"
        data-max-width="100%"
      >
        {devices.map((device) => (
          <SettingsDevice key={device.id} {...device} />
        ))}
      </ul>
    </section>
  );
}
