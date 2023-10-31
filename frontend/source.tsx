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
      <div class="c-badge" data-bg="gray-600" data-color="white">
        {props.status}
      </div>

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
