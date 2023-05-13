import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";

type ArticlePropsType = types.ArticleType &
  bg.UseListActionsType<types.ArticleType["id"]> &
  Omit<h.JSX.IntrinsicElements["li"], "title">;

export function Article(props: ArticlePropsType) {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger<types.ToastType>();

  const deleteArticle = useMutation(api.deleteArticle, {
    onSuccess: () => {
      queryClient.invalidateQueries("articles");
      queryClient.invalidateQueries("stats");
      notify({
        message: "article.deleted",
        articleId: props.id,
        articleTitle: props.title,
      });
    },
  });

  return (
    <li
      data-display="flex"
      data-md-direction="column"
      data-wrap="nowrap"
      data-mb="24"
      data-md-mx="6"
      {...bg.getAnimaProps(props)}
    >
      <div data-display="flex" data-wrap="nowrap" data-overflow="hidden">
        <input
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

          <small
            data-fs="12"
            data-color="gray-500"
            title={bg.DateFormatter.datetime(props.createdAt.raw)}
          >
            {props.createdAt.relative}
          </small>
        </div>
      </div>

      <div
        data-display="flex"
        data-direction="column"
        data-md-direction="row"
        data-cross="center"
        data-gap="6"
        data-ml="auto"
      >
        <UI.Badge data-self="start" data-width="100%" data-md-width="auto">
          {props.source}
        </UI.Badge>

        <div data-display="flex" data-wrap="nowrap">
          <UI.CopyButton
            data-mr="6"
            options={{
              text: props.url,
              onSuccess: () => notify({ message: "article.url.copied" }),
            }}
          />

          <button
            type="submit"
            title={t("article.delete")}
            class="c-button"
            data-variant="bare"
            onClick={() => deleteArticle.mutate(props.id)}
          >
            <Icons.RemoveSquare width="24" height="24" />
          </button>
        </div>
      </div>
    </li>
  );
}
