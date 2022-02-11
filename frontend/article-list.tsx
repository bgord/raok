import { h } from "preact";
import { useMutation, useQuery, useQueryClient } from "react-query";
import delay from "lodash/delay";

import * as UI from "./ui";
import { ArticleType } from "./types";
import { api } from "./api";
import { AnimaList, useAnimaList, Anima } from "./anima";
import { useNotificationTrigger } from "./notifications-context";
import { useList, useToggle } from "./hooks";

import { ScheduleFeedlyCrawlButton } from "./schedule-feedly-crawl-button";
import { AddArticleForm } from "./add-article-form";
import { Article } from "./article";

export function ArticleList(props: { initialData: ArticleType[] }) {
  const [selectedArticleIds, actions] = useList<ArticleType["id"]>();
  const emptyNewspaperError = useToggle();

  const createNewspaper = useCreateNewspaper(actions.clear);

  const _articles = useQuery("articles", api.getArticles, props);
  const articles = useAnimaList(_articles.data ?? [], "tail");

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
          Articles
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
              Select all
            </button>

            <button
              onClick={actions.clear}
              type="button"
              class="c-button"
              data-variant="secondary"
            >
              Deselect all
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

          <Anima visible={selectedArticleIds.length > 0} style="opacity">
            <div data-ml="auto" data-mb="6" data-color="gray-600" data-fs="14">
              {selectedArticleIds.length}/5 articles
            </div>
          </Anima>

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
              >
                Select min. 1 article
              </div>
            )}

            <button type="submit" class="c-button" data-variant="primary">
              Create newspaper
            </button>
          </form>
        </div>
      </div>

      {articles.count === 0 && (
        <small
          data-fs="14"
          data-color="gray-600"
          data-md-px="12"
          data-mt="24"
          data-ml="6"
        >
          No articles available at the moment
        </small>
      )}

      <AnimaList data-mt="24">
        {articles.items.map((article) => (
          <Anima key={article.item.id} style="opacity" {...article.props}>
            <Article {...article.item} {...actions} />
          </Anima>
        ))}
      </AnimaList>
    </section>
  );
}

function useCreateNewspaper(callback?: VoidFunction) {
  const queryClient = useQueryClient();
  const notify = useNotificationTrigger();

  return useMutation(api.createNewspaper, {
    onSuccess: () => {
      queryClient.invalidateQueries("newspapers");
      notify({ type: "success", message: "Newspaper scheduled" });
      delay(() => queryClient.invalidateQueries("articles"), 500);
      callback?.();
    },
  });
}
