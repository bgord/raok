import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h } from "preact";
import { useMutation } from "react-query";

import * as api from "./api";
import * as types from "./types";

type ArticleHomepagePropsType = Pick<types.ArticleType, "id" | "url">;

export function ArticleHomepage(props: ArticleHomepagePropsType) {
  const t = bg.useTranslations();
  const homepage = new URL(props.url).origin;

  const articleHomepageOpened = useMutation(api.Article.homepageOpened);

  return (
    <button
      class="c-button"
      data-variant="bare"
      type="button"
      title={t("article.homepage")}
      onClick={bg.exec([
        () => window.open(homepage),
        () => articleHomepageOpened.mutate(props.id),
      ])}
      {...bg.Rhythm().times(2).style.height}
    >
      <Icons.Home width="18" height="18" />
    </button>
  );
}
