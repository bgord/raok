import { h } from "preact";
import * as bg from "@bgord/frontend";

import * as UI from "./ui";
import * as types from "./types";

export function ArchiveArticle(props: types.ArchiveArticleType) {
  const notify = bg.useToastTrigger();

  return (
    <li
      data-display="flex"
      data-cross="center"
      data-wrap="nowrap"
      data-mb="24"
      data-max-width="768"
      data-width="100%"
    >
      <div
        data-display="flex"
        data-direction="column"
        data-mr="12"
        data-md-mr="0"
        data-overflow="hidden"
      >
        <div
          data-width="100%"
          data-transform="truncate"
          title={String(props.title)}
        >
          {props.title}
        </div>

        <UI.OutboundLink
          href={props.url}
          data-mr="12"
          data-md-mr="0"
          data-width="100%"
          data-fs="14"
          title={props.url}
        >
          {props.url}
        </UI.OutboundLink>
      </div>

      <div
        data-display="flex"
        data-md-display="none"
        data-direction="column"
        data-cross="end"
        data-ml="auto"
        data-mr="6"
      >
        <UI.Badge data-mb="6">{props.status}</UI.Badge>

        <UI.Badge>{props.source}</UI.Badge>
      </div>

      <UI.CopyButton
        options={{
          text: props.url,
          onSuccess: () => notify({ message: "article.url.copied" }),
        }}
      />
    </li>
  );
}
