/* eslint-disable jsx-a11y/label-has-associated-control */
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";

import { ArticleHomepage } from "./article-homepage";

type ArticlePropsType = types.ArticleType &
  bg.UseListActionsType<types.ArticleType["id"]> &
  Omit<h.JSX.IntrinsicElements["li"], "title">;

export function Article(props: ArticlePropsType) {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger<types.ToastType>();

  const articleUrlCopied = bg.useRateLimiter({
    limitMs: bg.Time.Seconds(2).ms,
    action: () => notify({ message: "article.url.copied" }),
  });

  const deleteArticle = useMutation(api.deleteArticle, {
    onSuccess: () => {
      queryClient.invalidateQueries("articles");
      queryClient.refetchQueries("articles-search");
      queryClient.invalidateQueries("stats");
      notify({
        message: "article.deleted",
        articleId: props.id,
        articleTitle: props.title,
      });

      if (props.isAdded(props.id)) {
        props.toggle(props.id);
      }
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  return (
    <li
      data-display="flex"
      data-md-direction="column"
      data-wrap="nowrap"
      data-mb="12"
      data-md-mx="6"
      {...bg.getAnimaProps(props)}
    >
      <div data-display="flex" data-wrap="nowrap" data-overflow="hidden">
        <label htmlFor={props.id} />
        <input
          id={props.id}
          onClick={() => props.toggle(props.id)}
          checked={props.isAdded(props.id)}
          class="c-checkbox"
          type="checkbox"
          data-my="auto"
          data-mr="12"
        />
        <div
          data-display="flex"
          data-direction="column"
          data-max-width="100%"
          data-overflow="hidden"
          data-mr="12"
          data-md-mr="3"
        >
          <UI.ArticleTitle title={String(props.title)} />
          <UI.ArticleUrl url={props.url} />

          <UI.Info title={bg.DateFormatter.datetime(props.createdAt.raw)}>
            {props.createdAt.relative}
          </UI.Info>
        </div>
      </div>

      <div
        data-display="flex"
        data-direction="column"
        data-md-direction="row"
        data-cross="center"
        data-ml="auto"
      >
        <UI.Badge
          data-self="start"
          data-width="100%"
          data-md-width="auto"
          data-mt="3"
          data-mr="3"
        >
          {props.source}
        </UI.Badge>

        <div data-display="flex" data-wrap="nowrap" data-gap="3">
          <UI.CopyButton
            options={{ text: props.url, onSuccess: articleUrlCopied }}
          />

          <ArticleHomepage {...props} />

          <button
            type="submit"
            title={t("article.delete")}
            class="c-button"
            data-variant="bare"
            onClick={() => deleteArticle.mutate(props.id)}
          >
            <Icons.XmarkSquare width="20" height="20" />
          </button>
        </div>
      </div>
    </li>
  );
}
