import { h } from "preact";
import { useMutation, useQuery, useQueryClient } from "react-query";
import delay from "lodash/delay";

import * as UI from "./ui";
import { ArticleType } from "./types";
import { api } from "./api";
import { useNotificationTrigger } from "./notifications-context";
import { useList, useToggle } from "./hooks";
import { AddArticleForm } from "./add-article-form";
import { Article } from "./article";

export function ArticleList(props: { initialData: ArticleType[] }) {
  const queryClient = useQueryClient();
  const notify = useNotificationTrigger();
  const [selectedArticleIds, actions] = useList<ArticleType["id"]>();
  const emptyNewspaperError = useToggle();

  const articles = useQuery(["articles"], api.getArticles, props);

  const createNewspaper = useMutation(api.createNewspaper, {
    onSuccess: () => {
      queryClient.invalidateQueries("newspapers");
      notify({ type: "success", message: "Newspaper scheduled" });
      delay(() => queryClient.invalidateQueries("articles"), 500);
      actions.clear();
    },
  });
  const scheduleFeedlyArticlesCrawl = useScheduleFeedlyArticlesCrawl();

  return (
    <section>
      <div data-bg="gray-100" data-bct="gray-200" data-bwt="4" data-p="12">
        <UI.Header data-display="flex" data-pb="6">
          <img
            loading="eager"
            height="20"
            width="20"
            src="/icon-article.svg"
            alt=""
            data-mr="12"
          />
          Articles
          <button
            onClick={() => scheduleFeedlyArticlesCrawl.mutate()}
            disabled={
              scheduleFeedlyArticlesCrawl.isLoading ||
              scheduleFeedlyArticlesCrawl.isSuccess
            }
            class="c-button"
            data-variant="bare"
            data-ml="auto"
          >
            {scheduleFeedlyArticlesCrawl.isIdle && "Schedule Feedly crawl"}
            {scheduleFeedlyArticlesCrawl.isLoading && "Scheduling..."}
            {scheduleFeedlyArticlesCrawl.isSuccess && "Scheduled!"}
            {scheduleFeedlyArticlesCrawl.isError && "Couldn't schedule"}
          </button>
        </UI.Header>

        <AddArticleForm />

        <div data-display="flex" data-cross="center" data-mt="12">
          <button
            onClick={() =>
              actions.add(
                articles.isSuccess ? articles.data.map((x) => x.id) : []
              )
            }
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
            onClick={() => articles.refetch()}
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
              data-anime-effect={articles.isRefetching && "rotate"}
            />
          </button>

          {selectedArticleIds.length > 0 && (
            <div data-ml="12" data-color="gray-600" data-fs="14">
              {selectedArticleIds.length}/5 articles
            </div>
          )}

          {emptyNewspaperError.on && (
            <div data-ml="12" data-color="gray-600" data-fs="14">
              Select at least one article
            </div>
          )}

          <form
            data-ml="auto"
            onSubmit={(event) => {
              event.preventDefault();

              if (selectedArticleIds.length === 0) {
                emptyNewspaperError.enable();
                return;
              } else {
                emptyNewspaperError.disable();
              }

              createNewspaper.mutate(selectedArticleIds);
            }}
          >
            <button type="submit" class="c-button" data-variant="primary">
              Create newspaper
            </button>
          </form>
        </div>
      </div>

      {articles.isSuccess && articles.data.length === 0 && (
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

      <ul data-mt="24">
        {articles.isSuccess &&
          articles.data.map((article) => (
            <Article key={article.id} {...article} {...actions} />
          ))}
      </ul>
    </section>
  );
}

function useScheduleFeedlyArticlesCrawl() {
  const queryClient = useQueryClient();
  const notify = useNotificationTrigger();

  const scheduleFeedlyArticlesCrawl = useMutation(
    api.scheduleFeedlyArticlesCrawl,
    {
      onSuccess() {
        delay(scheduleFeedlyArticlesCrawl.reset, 5000);
        notify({ type: "success", message: "Feedly crawl scheduled" });
        queryClient.invalidateQueries("stats");
      },
    }
  );

  return scheduleFeedlyArticlesCrawl;
}
