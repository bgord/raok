import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useQueryClient, useMutation } from "react-query";
import * as Icons from "iconoir-react";

import * as types from "./types";
import * as api from "./api";

export function ArticleSourceAdd(props: types.ArticleType) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const addArticleSourceRequest = useMutation(api.Source.create, {
    onSuccess: () => {
      queryClient.invalidateQueries("sources");
      notify({ message: "article.source.added" });
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  const homepage = new URL(props.url).origin;

  const addArticleSource = bg.useRateLimiter({
    limitMs: bg.Time.Seconds(10).ms,
    action: () => addArticleSourceRequest.mutate(homepage),
  });

  if (!homepage) return null;

  return (
    <button
      title={t("article.source.add")}
      type="button"
      class="c-button"
      data-variant="bare"
      onClick={addArticleSource}
      disabled={addArticleSourceRequest.isLoading}
    >
      <Icons.RssFeed width="20" height="20" />
    </button>
  );
}
