import { h } from "preact";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as types from "./types";

type ArticleHomepagePropsType = Pick<types.ArticleType, "url">;

export function ArticleHomepage(props: ArticleHomepagePropsType) {
  const t = bg.useTranslations();

  return (
    <button
      class="c-button"
      data-variant="bare"
      type="button"
      title={t("article.homepage")}
      onClick={() => window.open(new URL(props.url).origin)}
    >
      <Icons.Home width="22" height="22" />
    </button>
  );
}
