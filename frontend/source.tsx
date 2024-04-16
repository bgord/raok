import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h } from "preact";

import * as UI from "./ui";
import * as types from "./types";

import { SourceDelete } from "./source-delete";
import { SourceArchive } from "./source-archive";
import { SourceReactivate } from "./source-reactivate";
import { SourceQuality } from "./source-quality";
import { SourcePreview } from "./source-preview";
import { Health } from "./health";

export function Source(
  props: types.SourceType & h.JSX.IntrinsicElements["li"]
) {
  // prettier-ignore
  const {  url, status, id, name, createdAt, updatedAt, revision, quality, ...rest } = props;
  // prettier-ignore
  const source = {  id, name, createdAt, updatedAt, url, status, revision, quality };

  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();

  const sourceUrlCopied = bg.useRateLimiter({
    limitMs: bg.Time.Seconds(2).ms,
    action: () => notify({ message: "source.url.copied" }),
  });

  const hover = bg.useHover({ enabled: Boolean(props.draggable) });

  return (
    <li
      data-display="flex"
      data-cross="center"
      data-wrap="nowrap"
      data-md-wrap="wrap"
      data-max-width="100%"
      data-position="relative"
      data-gap="6"
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

      <Health {...props} />

      {props.status === types.SourceStatusEnum.active && (
        <div class="c-badge" data-color="green-700" data-bg="green-100">
          {props.status}
        </div>
      )}

      {props.status === types.SourceStatusEnum.inactive && (
        <div class="c-badge">{props.status}</div>
      )}

      <UI.OutboundLink
        href={props.url}
        data-fs="14"
        data-transform="truncate"
        data-md-width="100%"
        data-max-width="100%"
        title={props.url}
      >
        {props.url}
      </UI.OutboundLink>

      <UI.Info
        data-transform="nowrap"
        data-ml="auto"
        title={bg.DateFormatter.datetime(props.updatedAt.raw)}
      >
        {t("source.usage", {
          when: props.updatedAt.relative,
          count: props.countValue,
        })}
      </UI.Info>

      <SourceQuality {...props} />

      <SourcePreview id={props.id} />

      <UI.CopyButton
        options={{ text: props.url, onSuccess: sourceUrlCopied }}
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
