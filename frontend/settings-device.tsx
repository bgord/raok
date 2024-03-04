import { h } from "preact";

import * as types from "./types";
import { SettingsDeviceDelete } from "./settings-device-delete";

export function SettingsDevice(
  props: types.DeviceType & { numberOfDevices: number },
) {
  return (
    <li
      data-display="flex"
      data-wrap="nowrap"
      data-gap="12"
      data-max-width="100%"
    >
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
