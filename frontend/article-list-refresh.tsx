import { h } from "preact";
import { useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as api from "./api";

export function ArticleListRefresh() {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();

  const refreshArticles = bg.useRateLimiter({
    limitMs: bg.Time.Seconds(2).ms,
    action: () => {
      queryClient.refetchQueries(api.keys.articles);
      notify({ message: "articles.refreshed" });
    },
  });

  return (
    <button
      onClick={() => refreshArticles()}
      type="button"
      title={t("articles.refresh")}
      class="c-button"
      data-variant="bare"
      data-display="flex"
      data-main="center"
      data-cross="center"
      data-ml="auto"
      data-mr="3"
    >
      <Icons.Refresh />
    </button>
  );
}
