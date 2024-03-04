import * as bg from "@bgord/frontend";
import { h } from "preact";

import * as UI from "./ui";
import * as types from "./types";
import { SettingsDeviceDelete } from "./settings-device-delete";

export function SettingsDevice(
  props: types.DeviceType & { index: number; numberOfDevices: number }
) {
  const t = bg.useTranslations();

  return (
    <li
      data-display="flex"
      data-wrap="nowrap"
      data-gap="12"
      data-max-width="100%"
    >
      {props.index === 0 && <UI.Badge>{t("device.default")}</UI.Badge>}
      <strong data-fs="14" data-transform="nowrap">
        {props.name}
      </strong>
      <div
        data-fs="14"
        data-max-width="100%"
        data-transform="truncate"
        title={props.email}
      >
        {props.email}
      </div>

      {props.numberOfDevices > 1 && <SettingsDeviceDelete {...props} />}
    </li>
  );
}
