import { h } from "preact";

import * as UI from "./ui";
import { ArticleType } from "./types";
import { FavouriteUnfavourite } from "./favourite-unfavourite";

export function NewspaperArticle(props: ArticleType) {
  return (
    <li
      data-display="flex"
      data-wrap="nowrap"
      data-mb="12"
      data-max-width="768"
      data-cross="center"
    >
      {props.status === "processed" && <FavouriteUnfavourite {...props} />}

      <UI.Link href={props.url} data-mx="12">
        {props.url}
      </UI.Link>

      <UI.Badge data-ml="auto" data-mr="6">
        {props.source}
      </UI.Badge>
    </li>
  );
}
