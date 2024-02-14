import * as bg from "@bgord/frontend";
import { h } from "preact";

import * as UI from "./ui";
import * as types from "./types";

const ratingToSortValue = {
  [types.ArticleRatingLevel.recommended]: 3,
  [types.ArticleRatingLevel.default]: 2,
  [types.ArticleRatingLevel.unknown]: 0,
  [types.ArticleRatingLevel.not_recommended]: 1,
};

export function useArticleSort() {
  return bg.useClientSort<types.ArticleType>("sort-articles", {
    enum: types.ArticlesSortEnum,
    options: {
      [types.ArticlesSortEnum.default]: bg.defaultSortFn,
      [types.ArticlesSortEnum.most_rated]: (a, b) =>
        ratingToSortValue[b.rating] - ratingToSortValue[a.rating],
      [types.ArticlesSortEnum.least_rated]: (a, b) =>
        ratingToSortValue[a.rating] - ratingToSortValue[b.rating],
      [types.ArticlesSortEnum.longest_read]: (a, b) =>
        (b.estimatedReadingTimeInMinutes ?? 0) -
        (a.estimatedReadingTimeInMinutes ?? 0),
      [types.ArticlesSortEnum.shortest_read]: (a, b) =>
        (a.estimatedReadingTimeInMinutes ?? 0) -
        (b.estimatedReadingTimeInMinutes ?? 0),
    },
  });
}

export function ArticleListSort(
  props: bg.UseClientSortReturnType<types.ArticleType>
) {
  const t = bg.useTranslations();

  return (
    <div
      data-display="flex"
      data-md-direction="column"
      data-cross="center"
      data-md-cross="start"
      data-gap="6"
      data-md-gap="0"
      data-wrap="nowrap"
    >
      <label class="c-label" data-transform="nowrap" {...props.label.props}>
        {t("sort")}
      </label>

      <UI.Select
        key={props.value}
        value={props.value}
        onInput={props.handleChange}
        {...props.input.props}
      >
        {props.options.map((option) => (
          <option key={option} value={option}>
            {t(`article.sort.${option}`)}
          </option>
        ))}
      </UI.Select>
    </div>
  );
}
