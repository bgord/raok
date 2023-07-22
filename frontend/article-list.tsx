import { h } from "preact";
import { useQuery, useInfiniteQuery, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as contexts from "./contexts";
import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";

import { ScheduleFeedlyCrawlButton } from "./schedule-feedly-crawl-button";
import { AddArticleForm } from "./add-article-form";
import { ArticleActions } from "./article-actions";
import { Article } from "./article";
import { ArticleListRefresh } from "./article-list-refresh";

export function ArticleList() {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();

  const newspaperCreator = contexts.useNewspaperCreator();

  const stats = useQuery("stats", api.getStats);
  const numberOfNonProcessedArticles = stats.data?.numberOfNonProcessedArticles;

  bg.useDocumentTitle(
    `[${numberOfNonProcessedArticles}] RAOK - read articles on Kindle`
  );

  const _articles = useInfiniteQuery(
    "articles",
    ({ pageParam = 1 }) => api.getPagedArticles(pageParam),
    {
      getNextPageParam: (page) => page.meta.nextPage,
      onSuccess: () => stats.refetch(),
      refetchOnMount: true,
    }
  );

  const articles = bg.Pagination.infinite(_articles);

  const articlesSearch =
    queryClient.getQueryData<types.ArticleType[]>("articles-search") ?? [];
  const articlesSearchResults = articlesSearch.length;

  const searchModeEnabled = articlesSearchResults > 0;

  return (
    <section>
      <div data-bg="gray-100" data-p="12" data-pt="6" data-mb="6" data-shadow>
        <UI.Header data-display="flex" data-cross="center" data-gap="6">
          <Icons.Notes height="20px" width="20px" />

          <span data-mr="6">{t("app.articles")}</span>

          <div
            class="c-badge"
            data-ml="6"
            data-bg="gray-600"
            data-color="white"
            data-fw="500"
            {...bg.Rhythm().times(2).style.minWidth}
          >
            {numberOfNonProcessedArticles}
          </div>

          <ArticleListRefresh />

          <ScheduleFeedlyCrawlButton data-ml="auto" />
        </UI.Header>

        <AddArticleForm />
      </div>

      <ArticleActions />

      {!searchModeEnabled && (
        <UI.Info data-md-px="12" data-mb="24" data-ml="6">
          {t("articles.list.results", {
            current: articles.length,
            max: Number(numberOfNonProcessedArticles),
          })}
        </UI.Info>
      )}

      {searchModeEnabled && (
        <UI.Info data-md-px="12" data-mb="24" data-ml="6">
          {t("articles.search.results", { count: articlesSearchResults })}
        </UI.Info>
      )}

      {searchModeEnabled && (
        <ul>
          {articlesSearch.map((article) => (
            <Article
              key={article.id}
              {...article}
              {...newspaperCreator.actions}
            />
          ))}
        </ul>
      )}

      {!searchModeEnabled && articles.length === 0 && (
        <UI.Info data-md-px="12" data-mt="24" data-ml="6">
          {t("dashboard.no_articles_available")}
        </UI.Info>
      )}

      {!searchModeEnabled && (
        <ul>
          {articles.map((article) => (
            <Article
              key={article.id}
              {...article}
              {...newspaperCreator.actions}
            />
          ))}
        </ul>
      )}

      {!searchModeEnabled && _articles.hasNextPage && (
        <div data-display="flex">
          <button
            type="button"
            class="c-button"
            data-variant="bare"
            data-mx="auto"
            onClick={() => _articles.fetchNextPage()}
          >
            {t("app.load_more")}
          </button>
        </div>
      )}
    </section>
  );
}
