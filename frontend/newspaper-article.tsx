import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as UI from "./ui";
import { api } from "./api";
import { ArticleType, NewspaperType } from "./types";
import { useNotificationTrigger } from "./notifications-context";

export function NewspaperArticle(props: ArticleType) {
  const queryClient = useQueryClient();
  const notify = useNotificationTrigger();

  const addArticleToFavourites = useMutation(api.addArticleToFavourites, {
    onSuccess: () => {
      queryClient.invalidateQueries(["favourite-articles"]);

      queryClient.setQueryData<NewspaperType[]>(
        "newspapers",
        (newspapers = []) =>
          newspapers.map((newspaper) => ({
            ...newspaper,
            articles: newspaper.articles.map((article) => {
              if (article.id === props.id) {
                article.favourite = true;
              }
              return article;
            }),
          }))
      );

      notify({ type: "success", message: "Article added to favourites" });
    },
  });

  const deleteArticleFromFavourites = useMutation(
    api.deleteArticleFromFavourites,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["favourite-articles"]);

        queryClient.setQueryData<NewspaperType[]>(
          "newspapers",
          (newspapers = []) =>
            newspapers.map((newspaper) => ({
              ...newspaper,
              articles: newspaper.articles.map((article) => {
                if (article.id === props.id) {
                  article.favourite = false;
                }
                return article;
              }),
            }))
        );

        notify({ type: "success", message: "Article deleted from favourites" });
      },
    }
  );

  return (
    <li
      data-display="flex"
      data-wrap="nowrap"
      data-mb="12"
      data-max-width="768"
      data-px="12"
      data-cross="center"
    >
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
          data-mr="6"
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

      <UI.Link href={props.url} data-pr="12">
        {props.url}
      </UI.Link>

      <UI.Badge data-ml="auto">{props.source}</UI.Badge>
    </li>
  );
}
