import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as api from "./api";
import * as types from "./types";

type ArticlePropsType = types.ArticleType &
  bg.UseListActionsType<types.ArticleType["id"]>;

export function ArticleMarkAsAdded(props: ArticlePropsType) {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger<types.ToastType>();

  const articleMarkAsRead = useMutation(api.Article.markAsRead, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.keys.articles);
      queryClient.refetchQueries(api.keys.articlesSearch);
      queryClient.invalidateQueries(api.keys.stats);
      notify({
        message: "article.marked-as-read",
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
      title={t("article.mark-as-read")}
      class="c-button"
      data-variant="bare"
      onClick={() => articleMarkAsRead.mutate(props)}
    >
      <Icons.DoubleCheck width="20" height="20" />
    </button>
  );
}
