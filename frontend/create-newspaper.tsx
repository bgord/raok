import { h } from "preact";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as UI from "./ui";

export function CreateNewspaper() {
  const t = bg.useTranslations();

  return (
    <div
      data-mt="48"
      data-bg="gray-100"
      data-p="12"
      data-bw="4"
      data-bct="gray-200"
    >
      <UI.Header data-display="flex" data-mb="24" data-transform="upper-first">
        <Icons.BookStack data-mr="12" />
        <span data-transform="upper-first">{t("app.create_newspaper")}</span>
      </UI.Header>
    </div>
  );
}
