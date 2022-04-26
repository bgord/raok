import { h } from "preact";
import { useMutation, useInfiniteQuery, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";

import * as UI from "./ui";
import * as api from "./api";
import { ArticleType } from "./types";

import { ScheduleFeedlyCrawlButton } from "./schedule-feedly-crawl-button";
import { DeleteOldArticles } from "./archive-old-articles";
import { AddArticleForm } from "./add-article-form";
import { Article } from "./article";

export function ArticleList(props: { initialData: ArticleType[] }) {
  const t = bg.useTranslations();

  const [selectedArticleIds, actions] = bg.useList<ArticleType["id"]>();
  const emptyNewspaperError = bg.useToggle();

  const createNewspaper = useCreateNewspaper(actions.clear);

  const _articles = useInfiniteQuery(
    "articles",
    ({ pageParam = 1 }) => api.getPagedArticles(pageParam),
    {
      getNextPageParam: (last, all) =>
        last.length > 0 ? all.length + 1 : undefined,
      initialData: {
        pages: [props.initialData],
        pageParams: [1],
      },
    }
  );

  const articles = bg.useAnimaList(_articles.data?.pages?.flat() ?? [], {
    direction: "tail",
  });

  return (
    // TODO: Decrease spacing on mobile
    <section>
      <div
        data-bg="gray-100"
        data-bct="gray-200"
        data-bwt="4"
        data-p="12"
        data-pt="6"
      >
        <UI.Header data-display="flex" data-cross="center">
          <img
            loading="eager"
            height="20"
            width="20"
            src="/icon-article.svg"
            alt=""
            data-mr="12"
          />
          <span data-transform="upper-first">{t("app.articles")}</span>
          <ScheduleFeedlyCrawlButton data-ml="auto" />
        </UI.Header>

        <AddArticleForm />

        <div data-display="flex" data-cross="end">
          <div data-display="flex" data-mt="24">
            <button
              onClick={() => actions.add(articles.items.map((x) => x.item.id))}
              type="button"
              class="c-button"
              data-variant="secondary"
              data-mr="12"
            >
              {t("dashboard.select_all")}
            </button>

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
              class="c-button"
              data-variant="bare"
              data-ml="12"
            >
              <img
                loading="eager"
                height="20"
                width="20"
                src="/icon-refresh.svg"
                alt=""
                data-anima-effect={_articles.isRefetching && "rotate"}
              />
            </button>
          </div>

          <bg.Anima visible={selectedArticleIds.length > 0} effect="opacity">
            <div data-ml="auto" data-mb="6" data-color="gray-600" data-fs="14">
              {selectedArticleIds.length}/5 articles
            </div>
          </bg.Anima>

          <form
            data-display="flex"
            data-mt="24"
            data-ml="auto"
            onSubmit={(event) => {
              event.preventDefault();

              if (selectedArticleIds.length === 0) {
                emptyNewspaperError.enable();
                return;
              }

              emptyNewspaperError.disable();

              createNewspaper.mutate(selectedArticleIds);
            }}
          >
            {emptyNewspaperError.on && (
              <div
                data-mr="12"
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

      <DeleteOldArticles data-mt="12" data-ml="12" />

      {articles.count === 0 && (
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

      <bg.AnimaList data-mt="24">
        {articles.items.map((article) => (
          <bg.Anima key={article.item.id} effect="opacity" {...article.props}>
            <Article {...article.item} {...actions} />
          </bg.Anima>
        ))}
      </bg.AnimaList>

      {_articles.hasNextPage && (
        <div data-display="flex">
          <button
            type="button"
            class="c-button"
            data-variant="bare"
            data-mx="auto"
            onClick={() => _articles.fetchNextPage()}
          >
            Load more
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
