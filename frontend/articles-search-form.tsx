/* eslint-disable @typescript-eslint/ban-ts-comment */
import { h } from "preact";
import { useQuery, useQueryClient } from "react-query";

import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as types from "./types";
import * as api from "./api";
import * as UI from "./ui";

export function ArticlesSearchForm() {
  const t = bg.useTranslations();
  const search = bg.useField("article-search", "");
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const articleSearch = useQuery(
    api.keys.articlesSearch,
    () => api.searchArticles(search.value as types.ArticleSearchQueryType),
    {
      enabled: false,
      retry: false,
      onError: (error: bg.ServerError) => {
        notify({ message: error.message });
        queryClient.setQueryData(api.keys.articlesSearch, []);
      },
    }
  );

  return (
    <form
      data-display="flex"
      data-wrap="nowrap"
      data-max-width="100%"
      data-gap="6"
      data-mb="24"
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
          data-width="100%"
          pattern={`.{${types.ARTICLE_SEARCH_QUERY_MIN_LENGTH},${types.ARTICLE_SEARCH_QUERY_MAX_LENGTH}}`}
          onInvalid={(event) =>
            // @ts-ignore
            event.target.setCustomValidity(
              t("articles.search.validation", {
                from: types.ARTICLE_SEARCH_QUERY_MIN_LENGTH,
                to: types.ARTICLE_SEARCH_QUERY_MAX_LENGTH,
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
                  from: types.ARTICLE_SEARCH_QUERY_MIN_LENGTH,
                  to: types.ARTICLE_SEARCH_QUERY_MAX_LENGTH,
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
        disabled={search.unchanged}
      >
        <Icons.Search width="24" height="24" />
      </button>

      <UI.ClearButton
        disabled={search.unchanged}
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
    query.length >= types.ARTICLE_SEARCH_QUERY_MIN_LENGTH &&
    query.length <= types.ARTICLE_SEARCH_QUERY_MAX_LENGTH
  );
}
