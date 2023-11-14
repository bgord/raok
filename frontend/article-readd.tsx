import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useQueryClient, useMutation } from "react-query";
import * as Icons from "iconoir-react";

import * as types from "./types";
import * as api from "./api";

export function ArticleReadd(props: types.NewspaperType["articles"][0]) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const readdArticleRequest = useMutation(api.addArticle, {
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
    >
      <Icons.RedoAction width="24" height="24" />
    </button>
  );
}
