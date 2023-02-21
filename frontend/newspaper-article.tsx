import { h } from "preact";
import * as bg from "@bgord/frontend";

import * as UI from "./ui";
import * as types from "./types";

export function NewspaperArticle(props: types.NewspaperType["articles"][0]) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();

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
      <UI.OutboundLink href={props.url} data-fs="14">
        {props.url}
      </UI.OutboundLink>

      <div
        data-display="flex"
        data-wrap="nowrap"
        data-cross="center"
        data-ml="auto"
        data-gap="6"
        data-pr="3"
      >
        <UI.Badge data-md-display="none">{props.source}</UI.Badge>

        <UI.CopyButton
          options={{
            text: props.url,
            onSuccess: () => notify({ message: t("article.link.copied") }),
          }}
        />
      </div>
    </li>
  );
}
