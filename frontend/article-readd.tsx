import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useQueryClient, useMutation } from "react-query";
import * as Icons from "iconoir-react";

import * as types from "./types";
import * as api from "./api";

export function ArticleReadd(props: Pick<types.ArticleType, "url">) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const readdArticleRequest = useMutation(api.Article.add, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.keys.articles);
      queryClient.invalidateQueries(api.keys.allArchiveArticles);
      queryClient.invalidateQueries(api.keys.stats);
      notify({ message: "article.readded" });
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  return (
    <button
      title={t("article.restore")}
      type="button"
      class="c-button"
      data-variant="bare"
      onClick={() => readdArticleRequest.mutate({ url: props.url })}
      {...bg.Rhythm().times(2).style.height}
    >
      <Icons.RedoAction width="20" height="20" />
    </button>
  );
}
