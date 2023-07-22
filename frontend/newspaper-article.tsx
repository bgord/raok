import * as bg from "@bgord/frontend";
import { h } from "preact";

import * as UI from "./ui";
import * as types from "./types";

import { ArticleReadd } from "./article-readd";
import { ArticleHomepage } from "./article-homepage";

export function NewspaperArticle(props: types.NewspaperType["articles"][0]) {
  const notify = bg.useToastTrigger();

  const articleUrlCopied = bg.useRateLimiter({
    limitMs: bg.Time.Seconds(2).ms,
    action: () => notify({ message: "article.url.copied" }),
  });

  return (
    <li
      data-display="flex"
      data-wrap="nowrap"
      data-gap="6"
      data-max-width="768"
      data-cross="center"
      data-mb="12"
      data-md-ml="3"
    >
      <UI.ArticleUrl url={props.url} />

      <div
        data-display="flex"
        data-wrap="nowrap"
        data-cross="center"
        data-gap="3"
        data-ml="auto"
        data-pr="3"
      >
        <UI.Badge data-md-display="none">{props.source}</UI.Badge>
        <UI.CopyButton
          options={{ text: props.url, onSuccess: articleUrlCopied }}
        />
        <ArticleHomepage {...props} />
        <ArticleReadd {...props} />
      </div>
    </li>
  );
}
