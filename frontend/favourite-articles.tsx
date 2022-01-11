import { h } from "preact";
import { useQueryClient, useQuery, useMutation } from "react-query";

import * as UI from "./ui";
import { api } from "./api";
import { ArticleType, NewspaperType } from "./types";

export function FavouriteArticles(props: { initialData: ArticleType[] }) {
  const queryClient = useQueryClient();

  const articles = useQuery(
    ["favourite-articles"],
    api.getFavouriteArticles,
    props
  );

  const deleteArticleFromFavourites = useMutation(
    api.deleteArticleFromFavourites,
    {
      onSuccess: (_response, articleId) => {
        queryClient.invalidateQueries(["favourite-articles"]);

        queryClient.setQueryData<NewspaperType[]>(
          "newspapers",
          (newspapers = []) =>
            newspapers.map((newspaper) => ({
              ...newspaper,
              articles: newspaper.articles.map((article) => {
                if (article.id === articleId) {
                  article.favourite = false;
                }
                return article;
              }),
            }))
        );
      },
    }
  );

  return (
    <div
      data-bg="gray-100"
      data-p="12"
      data-bw="4"
      data-bct="gray-200"
      data-mt="48"
    >
      <UI.Header
        data-display="flex"
        data-cross="center"
        data-mb="24"
        data-color="gray-700"
      >
        <img
          loading="eager"
          height="20"
          width="20"
          src="/icon-star.svg"
          alt=""
          data-mr="12"
        />
        Favourite articles
      </UI.Header>

      {articles.data?.length === 0 && (
        <small data-fs="14" data-color="gray-600">
          Your favourite sent articles will appear here
        </small>
      )}

      <ul style={{ listStyle: "none" }}>
        {articles.data?.map((article) => (
          <li
            data-display="flex"
            data-cross="center"
            data-overflow="hidden"
            data-wrap="nowrap"
            data-mb="12"
          >
            <UI.Link href={article.url}>{article.title || article.url}</UI.Link>

            <form
              data-ml="auto"
              onSubmit={(event) => {
                event.preventDefault();
                deleteArticleFromFavourites.mutate(article.id);
              }}
            >
              <button
                disabled={deleteArticleFromFavourites.isLoading}
                type="submit"
                class="c-button"
                data-variant="bare"
              >
                Remove
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
