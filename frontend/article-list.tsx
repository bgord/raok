import { h } from "preact";
import { useMutation, useQuery, useQueryClient } from "react-query";

import * as UI from "./ui";
import { ArticleType } from "./types";
import { api } from "./api";
import { useList } from "./hooks";

export function ArticleList() {
  const queryClient = useQueryClient();

  const [selectedArticleIds, actions] = useList<ArticleType["id"]>();

  const articles = useQuery(["articles"], api.getArticles, { initialData: [] });

  const deleteArticle = useMutation(api.deleteArticle, {
    onSuccess: () => queryClient.invalidateQueries(["articles"]),
  });

  const createNewspaper = useMutation(api.createNewspaper, {
    onSuccess: () => {
      queryClient.invalidateQueries(["newspapers"]);
      queryClient.invalidateQueries(["articles"]);
    },
  });

  return (
    <section>
      <div data-bg="gray-100" data-bw="1" data-bc="gray-200" data-p="12">
        <h2
          data-fs="16"
          data-color="gray-800"
          data-fw="500"
          data-bw="2"
          data-bcb="gray-200"
          data-pb="6"
        >
          Articles
        </h2>

        <div data-display="flex" data-mt="24">
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
            data-mr="auto"
          >
            Deselect all
          </button>

          <form
            onSubmit={(event) => {
              event.preventDefault();
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
        <small data-md-px="12" data-mt="12" data-ml="6">
          No articles added at the moment
        </small>
      )}

      <ul data-mt="24">
        {articles.isSuccess &&
          articles.data.map((article) => (
            <li
              data-display="flex"
              data-cross="center"
              data-wrap="nowrap"
              data-mb="24"
              data-md-px="6"
            >
              <input
                onClick={() => actions.toggle(article.id)}
                checked={actions.isAdded(article.id)}
                class="c-checkbox"
                type="checkbox"
                data-mr="12"
              />
              <UI.Link href={article.url} data-mr="12">
                {article.url}
              </UI.Link>

              <UI.Badge data-ml="auto" data-mr="12">
                {article.status}
              </UI.Badge>

              <UI.Badge data-mr="12">{article.source}</UI.Badge>

              {article.status === "ready" && (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    deleteArticle.mutate(article.id);
                  }}
                >
                  <button type="submit" class="c-button" data-variant="bare">
                    Delete
                  </button>
                </form>
              )}
            </li>
          ))}
      </ul>
    </section>
  );
}
