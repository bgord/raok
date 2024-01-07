import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as api from "./api";
import * as types from "./types";

type ArticlePropsType = types.ArticleType &
  bg.UseListActionsType<types.ArticleType["id"]>;

export function ArticleDelete(props: ArticlePropsType) {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger<types.ToastType>();

  const deleteArticle = useMutation(api.Article.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.keys.articles);
      queryClient.refetchQueries(api.keys.articlesSearch);
      queryClient.invalidateQueries(api.keys.stats);
      notify({
        message: "article.deleted",
        articleId: props.id,
        articleTitle: props.title,
        revision: props.revision,
      });

      if (props.isAdded(props.id)) props.toggle(props.id);
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  return (
    <button
      type="submit"
      title={t("article.delete")}
      class="c-button"
      data-variant="bare"
      onClick={() => deleteArticle.mutate(props)}
      {...bg.Rhythm().times(2).style.height}
    >
      <Icons.XmarkSquare width="20" height="20" />
    </button>
  );
}
