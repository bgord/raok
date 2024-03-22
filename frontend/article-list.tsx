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
import { ArticleListSort, useArticleSort } from "./article-list-sort";

export function ArticleList() {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();
  const articleActions = bg.useToggle();

  const newspaperCreator = contexts.useNewspaperCreator();

  const stats = useQuery(api.keys.stats, api.getStats);
  const numberOfNonProcessedArticles = stats.data?.numberOfNonProcessedArticles;

  bg.useDocumentTitle(
    `[${numberOfNonProcessedArticles}] RAOK - read articles on Kindle`,
  );

  const sort = useArticleSort();

  const _articles = useInfiniteQuery(
    api.keys.articles,
    ({ pageParam = 1 }) => api.Article.listPaged(pageParam),
    {
      getNextPageParam: (page) => page.meta.nextPage,
      onSuccess: () => stats.refetch(),
      refetchOnMount: true,
    },
  );

  const articles = bg.Pagination.infinite(_articles).toSorted(sort.sortFn);

  const articlesSearch = (
    queryClient.getQueryData<types.ArticleType[]>(api.keys.articlesSearch) ?? []
  ).toSorted(sort.sortFn);
  const articlesSearchResults = articlesSearch.length;

  const searchModeEnabled = articlesSearchResults > 0;

  return (
    <section data-md-mb="24">
      <div
        data-bg="gray-100"
        data-p="12"
        data-pt="6"
        data-pr="6"
        data-md-p="6"
        data-shadow
      >
        <UI.Header data-display="flex" data-cross="center" data-gap="6">
          <div
            class="c-badge"
            data-bg="gray-600"
            data-color="white"
            data-fw="500"
            {...bg.Rhythm().times(2).style.minWidth}
          >
            {numberOfNonProcessedArticles}
          </div>
          <Icons.Notes
            data-md-display="none"
            height="20px"
            width="20px"
            data-ml="12"
          />
          <h4 data-fw="500" data-mt="3" data-md-my="auto">
            {t("app.articles")}
          </h4>
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
          {...articleActions.props.controller}
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

      {articleActions.on && (
        <div
          data-display="flex"
          data-wrap="nowrap"
          data-cross="center"
          data-md-cross="end"
          data-mb="24"
          data-md-mx="3"
          data-gap="6"
          {...articleActions.props.target}
        >
          <ArticleListSort {...sort} />
          <ArticlesSearchForm />
        </div>
      )}

      {searchModeEnabled && (
        <ul
          data-display="flex"
          data-direction="column"
          data-max-width="100%"
          data-wrap="nowrap"
          data-gap="12"
          data-mb="24"
        >
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
        <div
          data-display="flex"
          data-direction="column"
          data-cross="center"
          data-mt="48"
        >
          <UI.Info>{t("dashboard.no_articles_available")}</UI.Info>

          <img src="/book-empty-art.svg" width="300" height="200" alt="" />
        </div>
      )}

      {!searchModeEnabled && (
        <ul
          data-display="flex"
          data-direction="column"
          data-max-width="100%"
          data-wrap="nowrap"
          data-gap="12"
        >
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
