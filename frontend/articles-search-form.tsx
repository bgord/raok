import { h } from "preact";

import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as UI from "./ui";
import { ARTICLE_SEARCH_QUERY_MIN_LENGTH } from "../value-objects/article-search-query-min-length";
import { ARTICLE_SEARCH_QUERY_MAX_LENGTH } from "../value-objects/article-search-query-max-length";

export function ArticlesSearchForm() {
  const t = bg.useTranslations();
  const search = bg.useClientSearch();

  return (
    <form
      data-display="flex"
      data-wrap="nowrap"
      data-max-width="100%"
      data-gap="6"
      data-mb="36"
      onSubmit={(event) => {
        event.preventDefault();

        console.log({ query: search.query });
      }}
    >
      <div data-position="relative" data-width="100%">
        <input
          list="articles"
          class="c-input"
          placeholder={t("articles.search.placeholder")}
          style="padding-right: 36px"
          data-width="100%"
          pattern={`.{${ARTICLE_SEARCH_QUERY_MIN_LENGTH},${ARTICLE_SEARCH_QUERY_MAX_LENGTH}}`}
          onInvalid={(event) =>
            // @ts-ignore
            event.target.setCustomValidity(t("articles.search.validation"))
          }
          value={search.query}
          onChange={(event) => {
            search.onChange(event);
            if (isSearchQueryValid(search.query)) {
              // @ts-ignore
              event.target.setCustomValidity("");
            }
          }}
        />
        <Icons.Search
          height="34"
          width="34"
          data-position="absolute"
          data-p="6"
          style="top: 1px; right: 1px; background: white;"
        />
      </div>

      <UI.ClearButton onClick={search.clear} />
    </form>
  );
}

function isSearchQueryValid(query: string) {
  return (
    query.length >= ARTICLE_SEARCH_QUERY_MIN_LENGTH &&
    query.length <= ARTICLE_SEARCH_QUERY_MAX_LENGTH
  );
}
