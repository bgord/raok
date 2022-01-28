import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as UI from "./ui";
import { api } from "./api";
import { ArticleType, NewspaperType } from "./types";
import { useNotificationTrigger } from "./notifications-context";

export function NewspaperArticle(props: ArticleType) {
  const addArticleToFavourites = useAddArticleToFavourites(props.id);
  const deleteArticleFromFavourites = useDeleteArticleFromFavourites(props.id);

  return (
    <li
      data-display="flex"
      data-wrap="nowrap"
      data-mb="12"
      data-max-width="768"
      data-pr="12"
      data-cross="center"
    >
      {props.status === "processed" && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (props.favourite) {
              deleteArticleFromFavourites.mutate(props.id);
            } else {
              addArticleToFavourites.mutate(props.id);
            }
          }}
        >
          <button
            type="submit"
            class="c-button"
            data-variant="bare"
            data-mx="12"
            disabled={
              addArticleToFavourites.isLoading ||
              deleteArticleFromFavourites.isLoading
            }
          >
            {props.favourite && (
              <img
                loading="eager"
                height="20"
                width="20"
                src="/icon-star-filled.svg"
                alt=""
              />
            )}
            {!props.favourite && (
              <img
                loading="eager"
                height="20"
                width="20"
                src="/icon-star.svg"
                alt=""
              />
            )}
          </button>
        </form>
      )}

      <UI.Link href={props.url} data-mr="12" data-ml="6">
        {props.url}
      </UI.Link>

      <UI.Badge data-ml="auto" data-mr="6">
        {props.source}
      </UI.Badge>
    </li>
  );
}

function useAddArticleToFavourites(id: ArticleType["id"]) {
  const queryClient = useQueryClient();
  const notify = useNotificationTrigger();

  return useMutation(api.addArticleToFavourites, {
    onSuccess: () => {
      queryClient.invalidateQueries(["favourite-articles"]);

      queryClient.setQueryData<NewspaperType[]>(
        "newspapers",
        (newspapers = []) =>
          newspapers.map((newspaper) => ({
            ...newspaper,
            articles: newspaper.articles.map((article) => {
              if (article.id === id) {
                article.favourite = true;
              }
              return article;
            }),
          }))
      );

      notify({ type: "success", message: "Article added to favourites" });
    },
  });
}

function useDeleteArticleFromFavourites(id: ArticleType["id"]) {
  const queryClient = useQueryClient();
  const notify = useNotificationTrigger();

  return useMutation(api.deleteArticleFromFavourites, {
    onSuccess: () => {
      queryClient.invalidateQueries(["favourite-articles"]);

      queryClient.setQueryData<NewspaperType[]>(
        "newspapers",
        (newspapers = []) =>
          newspapers.map((newspaper) => ({
            ...newspaper,
            articles: newspaper.articles.map((article) => {
              if (article.id === id) {
                article.favourite = false;
              }
              return article;
            }),
          }))
      );

      notify({ type: "success", message: "Article deleted from favourites" });
    },
  });
}
