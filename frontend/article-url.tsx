import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h, Fragment } from "preact";
import { useMutation } from "react-query";

import * as api from "./api";
import * as UI from "./ui";
import * as types from "./types";

import { ArticleHomepage } from "./article-homepage";

type ArticlePropsType = types.ArticleType;

export function ArticleUrl(props: ArticlePropsType) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const articleOpened = useMutation(api.Article.opened);

  const details = bg.useToggle();

  const articleUrlCopied = bg.useRateLimiter({
    limitMs: bg.Time.Seconds(2).ms,
    action: () => notify({ message: "article.url.copied" }),
  });

  return (
    <div
      data-display="flex"
      data-cross="center"
      data-max-width="100%"
      data-width="100%"
      data-overflow="hidden"
      data-wrap="nowrap"
      data-gap={details.on ? "3" : "0"}
      {...bg.Rhythm().times(2).style.height}
    >
      <button
        type="button"
        class="c-button"
        data-variant="with-icon"
        onClick={details.toggle}
        style={{ marginLeft: "-6px" }}
        title={
          details.on ? t("article.actions.hide") : t("article.actions.show")
        }
      >
        {details.off && <Icons.NavArrowRight height="20" width="20" />}
        {details.on && <Icons.NavArrowDown height="20" width="20" />}
      </button>

      {details.on && (
        <Fragment>
          <ArticleHomepage {...props} />
          <UI.CopyButton
            data-pt="3"
            options={{ text: props.url, onSuccess: articleUrlCopied }}
          />
        </Fragment>
      )}
      <UI.ArticleUrl
        url={props.url}
        onClick={() => articleOpened.mutate(props.id)}
      />
    </div>
  );
}
