import { h } from "preact";
import * as bg from "@bgord/frontend";

import * as UI from "./ui";
import * as types from "./types";

import { ArticleReadd } from "./article-readd";

export function ArchiveArticle(props: types.ArchiveArticleType) {
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
      data-width="100%"
    >
      <div
        data-display="flex"
        data-direction="column"
        data-mr="12"
        data-md-mr="0"
        data-overflow="hidden"
      >
        <UI.Title title={String(props.title)} />

        <UI.ArticleUrl url={props.url} />
      </div>

      <div
        data-display="flex"
        data-md-display="none"
        data-direction="column"
        data-wrap="nowrap"
        data-ml="auto"
      >
        <div
          data-display="flex"
          data-cross="center"
          data-wrap="nowrap"
          data-gap="3"
        >
          <UI.Badge>{props.status}</UI.Badge>
          <UI.Badge>{props.source}</UI.Badge>
        </div>

        <UI.Info data-ml="auto" data-transform="nowrap" data-self="center">
          {props.createdAt.relative}
        </UI.Info>
      </div>

      <div
        data-display="flex"
        data-direction="column"
        data-self="start"
        data-md-ml="auto"
      >
        <UI.CopyButton
          options={{ text: props.url, onSuccess: articleUrlCopied }}
        />
        {props.status !== types.ArticleStatusEnum.ready && (
          <ArticleReadd {...props} />
        )}
      </div>
    </li>
  );
}
