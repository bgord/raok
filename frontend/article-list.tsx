import { h } from "preact";
import { useQuery, useInfiniteQuery, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as contexts from "./contexts";
import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";

import { ArticlesSearchForm } from "./articles-search-form";
import { ScheduleFeedlyCrawlButton } from "./schedule-feedly-crawl-button";
import { AddArticleForm } from "./add-article-form";
import { ArticleActions } from "./article-actions";
import { Article } from "./article";

export function ArticleList() {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();

  const newspaperCreator = contexts.useNewspaperCreator();

  const stats = useQuery("stats", api.getStats);
  const numberOfNonProcessedArticles = stats.data?.numberOfNonProcessedArticles;

  const _articles = useInfiniteQuery(
    "articles",
    ({ pageParam = 1 }) => api.getPagedArticles(pageParam),
    {
      getNextPageParam: (last) => last.meta.nextPage,
      onSuccess: () => stats.refetch(),
    }
  );

  const refreshArticles = bg.useRateLimiter({
    limitMs: bg.Time.Seconds(10).toMs(),
    action: () => {
      _articles.refetch();
      notify({ message: "articles.refreshed" });
    },
  });

  const articles = bg.Pagination.extract(_articles);

  const articlesSearch =
    queryClient.getQueryData<types.ArticleType[]>("articles-search") ?? [];
  const articlesSearchResults = articlesSearch.length;

  const searchModeEnabled = articlesSearchResults > 0;

  return (
    <section>
      <div data-bg="gray-100" data-p="12" data-pt="6" data-mb="12" data-shadow>
        <UI.Header data-display="flex" data-cross="center" data-gap="6">
          <Icons.Notes height="20px" width="20px" />

          <span data-mr="6">{t("app.articles")}</span>

          <span
            data-ml="6"
            data-bg="gray-200"
            data-fs="14"
            data-px="6"
            data-br="4"
          >
            {numberOfNonProcessedArticles}
          </span>

          <button
            onClick={refreshArticles}
            type="button"
            title={t("articles.refresh")}
            class="c-button"
            data-variant="bare"
            data-display="flex"
            data-main="center"
            data-cross="center"
            data-ml="12"
          >
            <Icons.Refresh />
          </button>

          <ScheduleFeedlyCrawlButton data-ml="auto" />
        </UI.Header>

        <AddArticleForm />
      </div>

      <ArticleActions />

      <ArticlesSearchForm />

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
