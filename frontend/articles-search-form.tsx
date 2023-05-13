import { h } from "preact";
import { useQuery } from "react-query";

import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as types from "./types";
import * as api from "./api";
import * as UI from "./ui";
import { ARTICLE_SEARCH_QUERY_MIN_LENGTH } from "../value-objects/article-search-query-min-length";
import { ARTICLE_SEARCH_QUERY_MAX_LENGTH } from "../value-objects/article-search-query-max-length";

export function ArticlesSearchForm() {
  const t = bg.useTranslations();
  const search = bg.useField("");
  const notify = bg.useToastTrigger();

  const articleSearch = useQuery(
    "articles-search",
    () => api.searchArticles(search.value as types.ArticleSearchQueryType),
    {
      enabled: false,
      retry: false,
      onError: (error: bg.ServerError) => notify({ message: t(error.message) }),
    }
  );

  return (
    <form
      data-display="flex"
      data-wrap="nowrap"
      data-max-width="100%"
      data-gap="6"
      data-mt="6"
      data-mb="12"
      data-md-mx="6"
      onSubmit={(event) => {
        event.preventDefault();
        articleSearch.refetch();
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
            event.target.setCustomValidity(
              t("articles.search.validation", {
                from: ARTICLE_SEARCH_QUERY_MIN_LENGTH,
                to: ARTICLE_SEARCH_QUERY_MAX_LENGTH,
              })
            )
          }
          value={search.value}
          onInput={(event) => {
            search.set(event.currentTarget.value);

            if (isSearchQueryValid(event.currentTarget.value)) {
              // @ts-ignore
              event.target.setCustomValidity("");
            } else {
              // @ts-ignore
              event.target.setCustomValidity(
                t("articles.search.validation", {
                  from: ARTICLE_SEARCH_QUERY_MIN_LENGTH,
                  to: ARTICLE_SEARCH_QUERY_MAX_LENGTH,
                })
              );
            }
          }}
        />
      </div>

      <button
        type="submit"
        class="c-button"
        data-variant="bare"
        data-display="flex"
        data-main="center"
        data-cross="center"
        title={t("app.search")}
      >
        <Icons.Search width="24" height="24" />
      </button>

      <UI.ClearButton
        onClick={() => {
          search.clear();

          // TODO: Fix this timeout
          setTimeout(() => articleSearch.refetch(), 25);
        }}
      />
    </form>
  );
}

function isSearchQueryValid(query: string) {
  return (
    query.length >= ARTICLE_SEARCH_QUERY_MIN_LENGTH &&
    query.length <= ARTICLE_SEARCH_QUERY_MAX_LENGTH
  );
}
