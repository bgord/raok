import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h } from "preact";

import * as UI from "./ui";
import * as types from "./types";

import { SourceDelete } from "./source-delete";
import { SourceArchive } from "./source-archive";
import { SourceReactivate } from "./source-reactivate";

export function Source(
  props: types.SourceType & h.JSX.IntrinsicElements["li"]
) {
  const { position, url, status, id, name, createdAt, updatedAt, ...rest } =
    props;
  const source = { position, id, name, createdAt, updatedAt, url, status };

  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();

  const hover = bg.useHover({ enabled: Boolean(props.draggable) });

  return (
    <li
      data-display="flex"
      data-cross="center"
      data-gap="6"
      data-wrap="nowrap"
      data-max-width="100%"
      data-position="relative"
      {...rest}
      {...hover.attach}
    >
      {hover.isHovering && (
        <Icons.List
          data-position="absolute"
          data-z="1"
          height="20"
          width="20"
          style={{ left: "-30px" }}
        />
      )}

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

      <UI.Info
        data-transform="nowrap"
        data-ml="auto"
        title={bg.DateFormatter.datetime(props.updatedAt.raw)}
      >
        {t("source.used_at", { when: props.updatedAt.relative })}
      </UI.Info>

      <UI.CopyButton
        options={{
          text: props.url,
          onSuccess: () => notify({ message: "source.url.copied" }),
        }}
      />

      {props.status === types.SourceStatusEnum.active && (
        <SourceArchive {...source} />
      )}
      {props.status === types.SourceStatusEnum.inactive && (
        <SourceReactivate {...source} />
      )}
      <SourceDelete {...source} />
    </li>
  );
}
