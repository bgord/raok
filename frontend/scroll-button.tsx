import * as bg from "@bgord/frontend";
import { h } from "preact";

import * as Icons from "iconoir-react";

export function ScrollButton() {
  const t = bg.useTranslations();
  const scroll = bg.useScroll();

  return (
    <bg.Anima
      visible={scroll.visible && scroll.position.hasChanged}
      effect="opacity"
    >
      <button
        type="button"
        className="c-button"
        data-z="2"
        data-variant="primary"
        data-position="fixed"
        data-bottom="0"
        data-left="0"
        data-display="flex"
        data-main="center"
        data-cross="center"
        data-wrap="nowrap"
        data-m="12"
        onClick={scroll.actions.goToTop}
        title={t("app.scroll_to_top")}
      >
        <Icons.ArrowUp height="36" width="36" />
      </button>
    </bg.Anima>
  );
}
