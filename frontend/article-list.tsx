import { h } from "preact";
import { useState } from "preact/hooks";
import { useMutation, useQuery, useQueryClient } from "react-query";

import * as UI from "./ui";
import { ArticleType } from "./types";

export function ArticleList() {
  const queryClient = useQueryClient();

  const [selectedArticleIds, setSelectedArticleIds] = useState<
    ArticleType["id"][]
  >([]);

  const articles = useQuery(
    ["articles"],
    async (): Promise<ArticleType[]> =>
      fetch("/articles", {
        method: "GET",
        mode: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      }).then((response) => (response.ok ? response.json() : [])),
    { initialData: [] }
  );

  const deleteArticle = useMutation(
    async (articleId: ArticleType["id"]) =>
      fetch(`/delete-article/${articleId}`, {
        method: "POST",
        mode: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      }),
    { onSuccess: () => queryClient.invalidateQueries(["articles"]) }
  );

  const createNewspaper = useMutation(
    async (articleIds: ArticleType["id"][]) =>
      fetch("/create-newspaper/", {
        method: "POST",
        mode: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        body: JSON.stringify({ articleIds }),
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["newspapers"]);
        queryClient.invalidateQueries(["articles"]);
      },
    }
  );

  function selectAllArticleIds() {
    if (!articles.isSuccess) return;

    setSelectedArticleIds(articles.data.map((x) => x.id));
  }

  function deselectAllArticleIds() {
    setSelectedArticleIds([]);
  }

  function toggleArticleId(articleId: ArticleType["id"]) {
    if (isArticleIdSelected(articleId)) {
      setSelectedArticleIds((articleIds) =>
        articleIds.filter((x) => x !== articleId)
      );
    } else {
      setSelectedArticleIds((articleIds) => [...articleIds, articleId]);
    }
  }

  function isArticleIdSelected(articleId: ArticleType["id"]) {
    return selectedArticleIds.some((x) => x === articleId);
  }

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
            onClick={selectAllArticleIds}
            type="button"
            class="c-button"
            data-variant="secondary"
            data-mr="12"
          >
            Select all
          </button>
          <button
            onClick={deselectAllArticleIds}
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
                onClick={() => toggleArticleId(article.id)}
                checked={isArticleIdSelected(article.id)}
                class="c-checkbox"
                type="checkbox"
                data-mr="12"
              />
              <UI.Link href={article.url} data-mr="12">
                {article.url}
              </UI.Link>

              <UI.Badge dat-ml="auto" data-mr="12">
                {article.status}
              </UI.Badge>

              <UI.Badge data-mr="12">{article.source}</UI.Badge>

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
            </li>
          ))}
      </ul>
    </section>
  );
}
