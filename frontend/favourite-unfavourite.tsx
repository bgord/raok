import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import { ArticleType, NewspaperType } from "./types";
import { useToastTrigger } from "./toasts-context";

type FavouriteUnfavouriteType = {
  id: ArticleType["id"];
  favourite: ArticleType["favourite"];
};

export function FavouriteUnfavourite(props: FavouriteUnfavouriteType) {
  const addArticleToFavourites = useAddArticleToFavourites(props.id);
  const deleteArticleFromFavourites = useDeleteArticleFromFavourites(props.id);

  return (
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
  );
}

function useAddArticleToFavourites(id: ArticleType["id"]) {
  const queryClient = useQueryClient();
  const notify = useToastTrigger();

  return useMutation(api.addArticleToFavourites, {
    onSuccess: () => {
      queryClient.invalidateQueries("favourite-articles");
      queryClient.invalidateQueries("archive-articles");

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

      notify({ message: "Article added to favourites" });
    },
  });
}

function useDeleteArticleFromFavourites(id: ArticleType["id"]) {
  const queryClient = useQueryClient();
  const notify = useToastTrigger();

  return useMutation(api.deleteArticleFromFavourites, {
    onSuccess: () => {
      queryClient.invalidateQueries("favourite-articles");
      queryClient.invalidateQueries("archive-articles");

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

      notify({ message: "Article deleted from favourites" });
    },
  });
}
