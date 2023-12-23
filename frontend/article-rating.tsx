import * as bg from "@bgord/frontend";
import { h } from "preact";

import * as types from "./types";

enum RatingLevel {
  default = "default",
  recommended = "recommended",
  not_recommended = "not_recommended",
}

function getRatingLevel(value: types.ArticleType["rating"]): RatingLevel {
  if (value === undefined || value === null) return RatingLevel.default;
  if (value < 0) return RatingLevel.not_recommended;
  if (value >= 0 && value <= 3) return RatingLevel.default;
  return RatingLevel.recommended;
}

export function ArticleRating(props: Pick<types.ArticleType, "rating">) {
  const level = getRatingLevel(props.rating);

  const ratingLevelToColor: Record<RatingLevel, string> = {
    [RatingLevel.recommended]: "green-300",
    [RatingLevel.default]: "gray-300",
    [RatingLevel.not_recommended]: "red-300",
  };

  return (
    <svg
      data-my="auto"
      data-color={ratingLevelToColor[level]}
      title={props.rating ? props.rating.toString() : "none"}
      {...bg.Rhythm(8).times(1).style.square}
    >
      <circle cx="50%" cy="50%" r="50%" fill="currentColor" />
    </svg>
  );
}
