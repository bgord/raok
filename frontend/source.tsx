import * as bg from "@bgord/frontend";
import { h } from "preact";

import * as UI from "./ui";
import * as types from "./types";

import { SourceDelete } from "./source-delete";
import { SourceArchive } from "./source-archive";
import { SourceReactivate } from "./source-reactivate";

export function Source(props: types.SourceType) {
  const notify = bg.useToastTrigger();

  return (
    <li
      data-display="flex"
      data-cross="center"
      data-gap="6"
      data-wrap="nowrap"
      data-max-width="100%"
    >
      {props.status === types.SourceStatusEnum.active && (
        <div class="c-badge" data-color="green-700" data-bg="green-100">
          {props.status}
        </div>
      )}

      {props.status === types.SourceStatusEnum.inactive && (
        <div class="c-badge">{props.status}</div>
      )}

      <div data-fs="14" data-transform="truncate" title={props.url}>
        {props.url}
      </div>

      <UI.Info data-transform="nowrap" data-ml="auto">
        {props.updatedAt.relative}
      </UI.Info>

      <UI.CopyButton
        options={{
          text: props.url,
          onSuccess: () => notify({ message: "source.url.copied" }),
        }}
      />

      {props.status === types.SourceStatusEnum.active && (
        <SourceArchive {...props} />
      )}
      {props.status === types.SourceStatusEnum.inactive && (
        <SourceReactivate {...props} />
      )}
      <SourceDelete {...props} />
    </li>
  );
}
