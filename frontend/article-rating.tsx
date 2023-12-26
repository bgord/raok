import * as bg from "@bgord/frontend";
import { h } from "preact";

import * as types from "./types";

export function ArticleRating(props: Pick<types.ArticleType, "rating">) {
  const ratingLevelToColor: Record<types.ArticleRatingLevel, string> = {
    [types.ArticleRatingLevel.recommended]: "green-300",
    [types.ArticleRatingLevel.default]: "gray-300",
    [types.ArticleRatingLevel.not_recommended]: "red-300",
  };

  return (
    <svg
      data-my="auto"
      data-color={ratingLevelToColor[props.rating]}
      title={props.rating ? props.rating.toString() : "none"}
      {...bg.Rhythm(8).times(1).style.square}
    >
      <circle cx="50%" cy="50%" r="50%" fill="currentColor" />
    </svg>
  );
}
