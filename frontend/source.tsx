import { h } from "preact";

import * as UI from "./ui";
import * as types from "./types";

import { SourceDelete } from "./source-delete";

export function Source(props: types.SourceType) {
  return (
    <li data-display="flex" data-cross="center" data-gap="6">
      <div class="c-badge" data-bg="gray-600" data-color="white">
        {props.status}
      </div>

      <div data-fs="14">{props.url}</div>

      <UI.Info data-ml="auto">{props.updatedAt.relative}</UI.Info>
      <SourceDelete {...props} />
    </li>
  );
}
