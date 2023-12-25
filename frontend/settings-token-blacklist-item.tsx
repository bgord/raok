import { h } from "preact";

import * as UI from "./ui";
import * as types from "./types";

export function SettingsTokenBlacklistItem(props: types.TokenBlacklistType) {
  return (
    <UI.Badge
      data-display="flex"
      data-wrap="nowrap"
      data-main="center"
      data-cross="center"
    >
      {props.token}

      <UI.ClearButton />
    </UI.Badge>
  );
}
