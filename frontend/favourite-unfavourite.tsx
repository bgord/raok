import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as api from "./api";
import * as types from "./types";

type FavouriteUnfavouriteType = {
  id: types.ArticleType["id"];
  /* eslint-disable react/boolean-prop-naming */
  favourite: boolean;
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
          <Icons.StarOutline style="fill: black" height="20" width="20" />
        )}
        {!props.favourite && <Icons.StarOutline height="20" width="20" />}
      </button>
    </form>
  );
}

function useAddArticleToFavourites(id: types.ArticleType["id"]) {
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();

  return useMutation(api.addArticleToFavourites, {
    onSuccess: () => {
      queryClient.invalidateQueries("favourite-articles");
      queryClient.invalidateQueries("archive-articles");

      queryClient.setQueryData<types.NewspaperType[]>(
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

      notify({ message: "article.favourites_added" });
    },
  });
}

function useDeleteArticleFromFavourites(id: types.ArticleType["id"]) {
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();

  return useMutation(api.deleteArticleFromFavourites, {
    onSuccess: () => {
      queryClient.invalidateQueries("favourite-articles");
      queryClient.invalidateQueries("archive-articles");

      queryClient.setQueryData<types.NewspaperType[]>(
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
