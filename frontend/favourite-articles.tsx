import { h } from "preact";
import { useQueryClient, useQuery, useMutation } from "react-query";

import * as UI from "./ui";
import { useExpandableList } from "./hooks";
import { api } from "./api";
import { ArticleType, NewspaperType } from "./types";
import { useNotificationTrigger } from "./notifications-context";

export function FavouriteArticles(props: { initialData: ArticleType[] }) {
  const queryClient = useQueryClient();
  const notify = useNotificationTrigger();

  const articles = useQuery(
    ["favourite-articles"],
    api.getFavouriteArticles,
    props
  );

  const list = useExpandableList({
    max: 5,
    length: articles?.data?.length ?? 0,
  });

  const deleteArticleFromFavourites = useMutation(
    api.deleteArticleFromFavourites,
    {
      onSuccess: (_response, articleId) => {
        notify({ type: "success", message: "Deleted from favourites" });

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
    <div data-bg="gray-100" data-p="12" data-bw="4" data-bct="gray-200">
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
        {articles.data?.filter(list.filterFn).map((article) => (
          <li
            data-display="flex"
            data-cross="center"
            data-overflow="hidden"
            data-wrap="nowrap"
            data-mb="6"
          >
            <UI.Link href={article.url} data-fs="14">
              {article.title || article.url}
            </UI.Link>

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

      {list.displayShowMore && (
        <button
          class="c-button"
          data-variant="bare"
          data-px="0"
          onClick={list.showMore}
        >
          Show {list.numberOfExcessiveElements} more
        </button>
      )}

      {list.displayShowLess && (
        <button class="c-button" data-variant="bare" onClick={list.showLess}>
          Show less
        </button>
      )}
    </div>
  );
}
