import { h } from "preact";
import { useQuery, useInfiniteQuery, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as contexts from "./contexts";
import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";

import { AddArticleForm } from "./add-article-form";
import { ArticlesSearchForm } from "./articles-search-form";
import { Article } from "./article";
import { ArticleListRefresh } from "./article-list-refresh";

export function ArticleList() {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();
  const articleActions = bg.useToggle();

  const newspaperCreator = contexts.useNewspaperCreator();

  const stats = useQuery(api.keys.stats, api.getStats);
  const numberOfNonProcessedArticles = stats.data?.numberOfNonProcessedArticles;

  bg.useDocumentTitle(
    `[${numberOfNonProcessedArticles}] RAOK - read articles on Kindle`
  );

  const _articles = useInfiniteQuery(
    api.keys.articles,
    ({ pageParam = 1 }) => api.Article.listPaged(pageParam),
    {
      getNextPageParam: (page) => page.meta.nextPage,
      onSuccess: () => stats.refetch(),
      refetchOnMount: true,
    }
  );

  const articles = bg.Pagination.infinite(_articles);

  const articlesSearch =
    queryClient.getQueryData<types.ArticleType[]>(api.keys.articlesSearch) ??
    [];
  const articlesSearchResults = articlesSearch.length;

  const searchModeEnabled = articlesSearchResults > 0;

  return (
    <section>
      <div
        data-bg="gray-100"
        data-p="12"
        data-pt="6"
        data-pr="6"
        data-md-p="6"
        data-shadow
      >
        <UI.Header data-display="flex" data-cross="center" data-gap="12">
          <div
            class="c-badge"
            data-bg="gray-600"
            data-color="white"
            data-fw="500"
            {...bg.Rhythm().times(2).style.minWidth}
          >
            {numberOfNonProcessedArticles}
          </div>

          <Icons.Notes height="20px" width="20px" />
          <span data-mt="3">{t("app.articles")}</span>

          <ArticleListRefresh />
        </UI.Header>

        <AddArticleForm />
      </div>

      <div
        data-display="flex"
        data-cross="center"
        data-main="between"
        data-mt="6"
        data-mb={articleActions.on ? "3" : "12"}
      >
        <button
          title={
            articleActions.on
              ? t("article.actions.hide")
              : t("article.actions.show")
          }
          type="button"
          class="c-button"
          data-display="flex"
          data-main="center"
          data-cross="center"
          data-gap="6"
          data-variant="bare"
          onClick={articleActions.toggle}
        >
          {articleActions.off && <Icons.NavArrowRight height="20" width="20" />}
          {articleActions.on && <Icons.NavArrowDown height="20" width="20" />}
          {t("article.actions")}
        </button>

        {!searchModeEnabled && articles.length > 0 && (
          <UI.Info data-md-mr="6" data-color="gray-500">
            {t("articles.list.results", {
              current: articles.length,
              max: Number(numberOfNonProcessedArticles),
            })}
          </UI.Info>
        )}

        {searchModeEnabled && (
          <UI.Info data-md-mr="6" data-color="gray-500">
            {t("articles.search.results", { count: articlesSearchResults })}
          </UI.Info>
        )}
      </div>

      {articleActions.on && <ArticlesSearchForm />}

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
