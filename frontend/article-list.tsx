import { h } from "preact";
import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";

import { ArticlesSearchForm } from "./articles-search-form";
import { ScheduleFeedlyCrawlButton } from "./schedule-feedly-crawl-button";
import { DeleteOldArticles } from "./delete-old-articles";
import { DeleteAllArticles } from "./delete-all-articles";
import { AddArticleForm } from "./add-article-form";
import { Article } from "./article";

export function ArticleList() {
  const t = bg.useTranslations();

  const [selectedArticleIds, actions] = bg.useList<types.ArticleType["id"]>();
  const emptyNewspaperError = bg.useToggle();

  const createNewspaper = useCreateNewspaper(actions.clear);

  const search = bg.useClientSearch();

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

  const articles = bg.Pagination.extract(_articles);

  return (
    <section>
      <div
        data-bg="gray-100"
        data-bct="gray-200"
        data-bwt="4"
        data-p="12"
        data-pt="6"
      >
        <UI.Header data-display="flex" data-cross="center">
          <Icons.Notes data-mr="12" />

          <span data-transform="upper-first">{t("app.articles")}</span>

          <span
            data-ml="6"
            data-bg="gray-200"
            data-fs="14"
            data-px="6"
            data-br="4"
          >
            {numberOfNonProcessedArticles}
          </span>

          <ScheduleFeedlyCrawlButton data-ml="auto" />
        </UI.Header>

        <AddArticleForm />

        <div data-display="flex" data-cross="end">
          <div data-display="flex" data-gap="12" data-mt="24">
            <button
              onClick={actions.clear}
              type="button"
              class="c-button"
              data-variant="secondary"
            >
              {t("dashboard.deselect_all")}
            </button>

            <button
              onClick={() => _articles.refetch()}
              type="button"
              title={t("articles.refresh")}
              class="c-button"
              data-variant="bare"
            >
              <Icons.Refresh
                data-anima-effect={_articles.isRefetching && "rotate"}
              />
            </button>
          </div>

          <bg.Anima visible={selectedArticleIds.length > 0} effect="opacity">
            <div data-ml="auto" data-mb="6" data-color="gray-600" data-fs="14">
              {t("articles.selected", {
                selected: selectedArticleIds.length,
                max: 5,
              })}
            </div>
          </bg.Anima>

          <form
            data-display="flex"
            data-gap="12"
            data-mt="24"
            data-ml="auto"
            onSubmit={(event) => {
              event.preventDefault();

              if (selectedArticleIds.length === 0) {
                return emptyNewspaperError.enable();
              }

              emptyNewspaperError.disable();
              return createNewspaper.mutate(selectedArticleIds);
            }}
          >
            {emptyNewspaperError.on && (
              <div
                data-my="auto"
                data-color="gray-600"
                data-fs="14"
                data-transform="upper-first"
              >
                {t("dashboard.select_min_1_article")}
              </div>
            )}

            <button type="submit" class="c-button" data-variant="primary">
              {t("newspaper.create")}
            </button>
          </form>
        </div>
      </div>

      <div
        data-display="flex"
        data-md-main="center"
        data-gap="24"
        data-mt="12"
        data-mb="24"
      >
        <DeleteOldArticles />
        <DeleteAllArticles />
      </div>

      <ArticlesSearchForm />

      {articles.length === 0 && (
        <small
          data-fs="14"
          data-color="gray-600"
          data-md-px="12"
          data-mt="24"
          data-ml="6"
          data-transform="upper-first"
        >
          {t("dashboard.no_articles_available")}
        </small>
      )}

      {articles.map((article) => (
        <Article key={article.id} {...article} {...actions} />
      ))}

      {_articles.hasNextPage && (
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

function useCreateNewspaper(callback?: VoidFunction) {
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();

  return useMutation(api.createNewspaper, {
    onSuccess: () => {
      queryClient.invalidateQueries("newspapers");
      notify({ message: "newspaper.scheduled" });
      setTimeout(() => queryClient.invalidateQueries("articles"), 500);
      callback?.();
    },
  });
}
