import { h } from "preact";

import * as UI from "./ui";
import { ArchiveArticleType } from "./types";
import { FavouriteUnfavourite } from "./favourite-unfavourite";

export function ArchiveArticle(props: ArchiveArticleType) {
  return (
    <li
      data-display="flex"
      data-cross="center"
      data-wrap="nowrap"
      data-mb="24"
      data-md-px="6"
      data-max-width="768"
      data-width="100%"
    >
      <div
        data-display="flex"
        data-direction="column"
        data-mr="12"
        data-overflow="hidden"
      >
        <div
          data-display="flex"
          data-cross="center"
          data-wrap="nowrap"
          data-max-width="100%"
        >
          {props.status === "processed" && <FavouriteUnfavourite {...props} />}
          <div
            data-width="100%"
            data-ml={props.status === "processed" && "12"}
            data-transform="truncate"
            title={props.title}
          >
            {props.title}
          </div>
        </div>
        <UI.OutboundLink
          href={props.url}
          data-mr="12"
          data-width="100%"
          data-fs="14"
          title={props.url}
        >
          {props.url}
        </UI.OutboundLink>
      </div>

      <div
        data-display="flex"
        data-direction="column"
        data-cross="center"
        data-ml="auto"
      >
        <UI.Badge data-mb="6">{props.status}</UI.Badge>
        <UI.Badge>{props.source}</UI.Badge>
      </div>
    </li>
  );
}
