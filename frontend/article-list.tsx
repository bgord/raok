import { h } from "preact";
import { useMutation, useQuery, useQueryClient } from "react-query";

import * as UI from "./ui";
import { ArticleType } from "./types";
import { api } from "./api";
import { useList, useToggle } from "./hooks";
import { AddArticleForm } from "./add-article-form";

export function ArticleList(props: { initialData: ArticleType[] }) {
  const queryClient = useQueryClient();

  const [selectedArticleIds, actions] = useList<ArticleType["id"]>();
  const emptyNewspaperError = useToggle();

  const articles = useQuery(["articles"], api.getArticles, props);

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
      <div data-bg="gray-100" data-bct="gray-200" data-bwt="4" data-p="12">
        <UI.Header
          data-display="flex"
          data-cross="center"
          data-pb="6"
          data-color="gray-700"
        >
          <img
            height="20"
            width="20"
            src="/icon-article.svg"
            alt=""
            data-mr="12"
          />
          Articles
        </UI.Header>

        <AddArticleForm />

        <div data-display="flex" data-cross="baseline" data-mt="12">
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

          {emptyNewspaperError.on && (
            <div data-mr="12" data-fs="14">
              Select at least one article
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();

              if (selectedArticleIds.length === 0) {
                emptyNewspaperError.setOn();
                return;
              } else {
                emptyNewspaperError.setOff();
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
        <small data-md-px="12" data-mt="12" data-ml="6">
          No articles available at the moment
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
              data-bcr="gray-100"
              data-bwr="4"
            >
              <input
                onClick={() => actions.toggle(article.id)}
                checked={actions.isAdded(article.id)}
                class="c-checkbox"
                type="checkbox"
                data-mr="12"
              />

              <div
                data-display="flex"
                data-direction="column"
                data-mr="12"
                data-overflow="hidden"
              >
                <div data-mb="6" data-width="100%" data-transform="truncate">
                  {article.title ?? "-"}
                </div>
                <UI.Link href={article.url} data-mr="12" data-width="100%">
                  {article.url}
                </UI.Link>
              </div>

              <UI.Badge data-ml="auto" data-mr="12">
                {article.status}
              </UI.Badge>

              <UI.Badge data-mr="6">{article.source}</UI.Badge>

              {article.status === "ready" && (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    deleteArticle.mutate(article.id);
                  }}
                >
                  <button type="submit" class="c-button" data-variant="bare">
                    <img
                      height="30"
                      width="30"
                      src="/icon-trash.svg"
                      alt="delete"
                    />
                  </button>
                </form>
              )}
            </li>
          ))}
      </ul>
    </section>
  );
}
