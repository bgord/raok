import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as api from "./api";
import * as UI from "./ui";
import * as types from "./types";
import { ServerError } from "./server-error";

export function ArchiveArticle(props: types.ArchiveArticleType) {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();

  const readdArticleRequest = useMutation(api.addArticle, {
    onSuccess: () => {
      queryClient.invalidateQueries("articles");
      queryClient.invalidateQueries("archive-articles");
      queryClient.invalidateQueries("stats");
      notify({ message: "article.readded" });
    },
    onError: (error: ServerError) => notify({ message: t(error.message) }),
  });

  return (
    <li
      data-display="flex"
      data-cross="center"
      data-wrap="nowrap"
      data-mb="24"
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
        <UI.ArticleTitle title={String(props.title)} />

        <UI.OutboundLink
          href={props.url}
          data-mr="12"
          data-md-mr="0"
          data-width="100%"
          data-fs="14"
          title={props.url}
        >
          {props.url}
        </UI.OutboundLink>
      </div>

      <div
        data-display="flex"
        data-md-display="none"
        data-direction="column"
        data-cross="end"
        data-ml="auto"
        data-mr="6"
      >
        <UI.Badge data-mb="6">{props.status}</UI.Badge>

        <UI.Badge>{props.source}</UI.Badge>
      </div>

      <div data-display="flex" data-direction="column" data-self="start">
        <UI.CopyButton
          options={{
            text: props.url,
            onSuccess: () => notify({ message: "article.url.copied" }),
          }}
        />
        {props.status !== types.ArticleStatusEnum.ready && (
          <button
            title={t("article.restore")}
            type="button"
            class="c-button"
            data-variant="bare"
            onClick={() => readdArticleRequest.mutate({ url: props.url })}
          >
            <Icons.RedoAction width="24" height="24" />
          </button>
        )}
      </div>
    </li>
  );
}
