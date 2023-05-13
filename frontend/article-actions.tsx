import * as bg from "@bgord/frontend";
import { h } from "preact";

import * as Icons from "iconoir-react";
import { DeleteOldArticles } from "./delete-old-articles";
import { DeleteAllArticles } from "./delete-all-articles";

export function ArticleActions() {
  const t = bg.useTranslations();
  const toggle = bg.useToggle();

  return (
    <div data-display="flex" data-direction="column">
      <button
        title={
          toggle.on ? t("article.actions.hide") : t("article.actions.show")
        }
        type="button"
        class="c-button"
        data-display="flex"
        data-main="center"
        data-cross="center"
        data-gap="6"
        data-variant="bare"
        data-ml="auto"
        onClick={toggle.toggle}
      >
        {t("article.actions")}
        {toggle.off && <Icons.NavArrowDown height="24" width="24" />}
        {toggle.on && <Icons.NavArrowUp height="24" width="24" />}
      </button>

      {toggle.on && (
        <div
          data-display="flex"
          data-main="center"
          data-gap="24"
          data-md-gap="12"
          data-ml="auto"
          data-mb="12"
          data-md-mb="24"
        >
          <DeleteOldArticles />
          <DeleteAllArticles />
        </div>
      )}
    </div>
  );
}
