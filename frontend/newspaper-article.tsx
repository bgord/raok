import { h } from "preact";

import * as UI from "./ui";
import { NewspaperType } from "./types";
import { FavouriteUnfavourite } from "./favourite-unfavourite";

export function NewspaperArticle(props: NewspaperType["articles"][0]) {
  return (
    <li
      data-display="flex"
      data-wrap="nowrap"
      data-max-width="768"
      data-cross="center"
      data-mb="12"
      data-md-ml="3"
    >
      {props.status === "processed" && <FavouriteUnfavourite {...props} />}

      <UI.OutboundLink href={props.url} data-fs="14" data-mx="12">
        {props.url}
      </UI.OutboundLink>

      <UI.Badge data-ml="auto" data-mr="6">
        {props.source}
      </UI.Badge>
    </li>
  );
}
