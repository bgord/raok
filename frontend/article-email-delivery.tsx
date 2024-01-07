import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as api from "./api";
import * as types from "./types";

type ArticlePropsType = types.ArticleType &
  bg.UseListActionsType<types.ArticleType["id"]>;

export function ArticleEmailDelivery(props: ArticlePropsType) {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger<types.ToastType>();

  const articleDeliverByEmail = useMutation(api.Article.deliverByEmail, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.keys.articles);
      queryClient.refetchQueries(api.keys.articlesSearch);
      queryClient.invalidateQueries(api.keys.stats);
      notify({
        message: "article.delivered-by-email",
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
      title={t("article.deliver-by-email")}
      class="c-button"
      data-variant="bare"
      onClick={() => articleDeliverByEmail.mutate(props)}
      {...bg.Rhythm().times(2).style.height}
    >
      <Icons.Mail width="20" height="20" />
    </button>
  );
}
