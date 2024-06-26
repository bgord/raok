import { h } from "preact";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { useMutation } from "react-query";

import * as api from "./api";
import * as UI from "./ui";
import * as types from "./types";

import { ArticleHomepage } from "./article-homepage";
import { ArticleMarkAsAdded } from "./article-mark-as-added";
import { ArticleDelete } from "./article-delete";
import { ArticleUrl } from "./article-url";
import { ArticleRating } from "./article-rating";

type ArticlePropsType = types.ArticleType &
  bg.UseListActionsType<types.ArticleType["id"]> &
  Omit<h.JSX.IntrinsicElements["li"], "title">;

export function Article(props: ArticlePropsType) {
  const t = bg.useTranslations();

  const articleOpened = useMutation(api.Article.opened);

  return (
    <li
      data-display="flex"
      data-md-direction="column"
      data-wrap="nowrap"
      data-md-mx="6"
    >
      <div
        data-display="flex"
        data-wrap="nowrap"
        data-gap="6"
        data-width="100%"
        data-overflow="hidden"
      >
        <div
          data-display="flex"
          data-md-display="none"
          data-cross="center"
          data-direction="column"
          data-gap="3"
          data-mt="3"
        >
          <div
            class="c-badge"
            data-main="center"
            data-fs="12"
            data-lh="12"
            data-p="3"
            data-transform="truncate"
            title={t("article.reading_time", {
              value: props.estimatedReadingTimeInMinutes ?? "·",
            })}
            {...bg.Rhythm().times(4).style.width}
          >
            {t("article.reading_time", {
              value: props.estimatedReadingTimeInMinutes ?? "·",
            })}
          </div>

          <label htmlFor={props.id} />
          <input
            id={props.id}
            onClick={() => props.toggle(props.id)}
            checked={props.isAdded(props.id)}
            class="c-checkbox"
            type="checkbox"
          />
        </div>

        <div
          data-display="flex"
          data-direction="column"
          data-max-width="100%"
          data-width="100%"
          data-overflow="hidden"
          data-mr="12"
          data-md-mr="3"
        >
          <div
            data-display="flex"
            data-max-width="100%"
            data-width="100%"
            data-overflow="hidden"
          >
            <UI.Title title={String(props.title)} />
            <UI.Info
              data-color="gray-500"
              data-my="3"
              data-lh="20"
              title={String(props.description)}
              {...bg.LineClamp()}
            >
              {props.description}
            </UI.Info>
          </div>
          <ArticleUrl {...props} />
        </div>
      </div>

      <div
        data-display="flex"
        data-direction="column"
        data-md-direction="row"
        data-cross="center"
        data-ml="auto"
        data-md-ml="unset"
        data-md-mt="6"
      >
        <label data-display="none" data-md-display="flex" htmlFor={props.id} />
        <input
          data-display="none"
          data-md-display="flex"
          data-mr="12"
          id={props.id}
          onClick={() => props.toggle(props.id)}
          checked={props.isAdded(props.id)}
          class="c-checkbox"
          type="checkbox"
        />

        <div
          class="c-badge"
          data-display="none"
          data-main="center"
          data-md-display="flex"
          data-md-mr="auto"
          data-fs="12"
          data-lh="12"
          data-p="3"
          data-transform="nowrap"
          {...bg.Rhythm().times(4).style.width}
        >
          {t("article.reading_time", {
            value: props.estimatedReadingTimeInMinutes ?? "·",
          })}
        </div>

        <div data-display="flex" data-wrap="nowrap" data-ml="auto" data-gap="6">
          <ArticleRating {...props} />
          <UI.Badge
            data-md-display="none"
            data-mt="3"
            data-mr="3"
            {...bg.Rhythm().times(7).style.minWidth}
          >
            {props.source}
          </UI.Badge>
        </div>

        <div
          data-display="flex"
          data-wrap="nowrap"
          data-mt="3"
          data-md-mt="0"
          data-gap="3"
          data-ml="auto"
          data-md-ml="12"
        >
          <ArticleHomepage {...props} />
          <ArticleMarkAsAdded {...props} />
          <button
            type="button"
            class="c-button"
            data-variant="with-icon"
            title={t("article.open")}
            onClick={bg.exec([
              () => articleOpened.mutate(props.id),
              () => window.open(props.url),
            ])}
            {...bg.Rhythm().times(2).style.height}
          >
            <Icons.OpenNewWindow height="16" width="16" />
          </button>
          <ArticleDelete {...props} />
        </div>

        <UI.Info
          data-transform="nowrap"
          data-md-display="none"
          data-color="gray-400"
          data-ml="auto"
          data-lh="16"
          title={bg.DateFormatter.datetime(props.createdAt.raw)}
        >
          {props.createdAt.relative}
        </UI.Info>
      </div>
    </li>
  );
}
