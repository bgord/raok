import { h } from "preact";
import {
  useQueryClient,
  UseInfiniteQueryResult,
  useMutation,
} from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as api from "./api";
import * as types from "./types";
import * as contexts from "./contexts";
import * as UI from "./ui";
import { ServerError } from "./server-error";
import { NEWSPAPER_MAX_ARTICLES_NUMBER } from "../value-objects/newspaper-max-articles-number";

export function CreateNewspaper() {
  const t = bg.useTranslations();

  const articles = useArticles();

  const newspaperCreator = contexts.useNewspaperCreator();
  const createNewspaper = useCreateNewspaper(newspaperCreator.actions.clear);

  return (
    <div
      data-mb="48"
      data-bg="gray-100"
      data-p="12"
      data-bw="4"
      data-bct="gray-200"
    >
      <UI.Header data-display="flex" data-mb="24" data-transform="upper-first">
        <Icons.BookStack data-mr="12" />
        <span data-transform="upper-first">{t("app.create_newspaper")}</span>
      </UI.Header>

      {newspaperCreator.selectedArticleIds.length > 0 && (
        <div data-color="gray-700" data-fs="14">
          {t("articles.selected", {
            selected: newspaperCreator.selectedArticleIds.length,
            max: NEWSPAPER_MAX_ARTICLES_NUMBER,
          })}
        </div>
      )}

      {newspaperCreator.selectedArticleIds.length === 0 && (
        <div data-color="gray-700" data-fs="14">
          {t("articles.select_prompt", { max: NEWSPAPER_MAX_ARTICLES_NUMBER })}
        </div>
      )}

      <ul
        data-display="flex"
        data-direction="column"
        data-wrap="nowrap"
        data-gap="12"
        data-my="12"
      >
        {newspaperCreator.selectedArticleIds.map((id) => {
          const article = articles.find((article) => article.id === id);

          if (!article) return null;

          return (
            <li
              data-display="flex"
              data-wrap="nowrap"
              data-gap="12"
              data-overflow="hidden"
            >
              <input
                onClick={() => newspaperCreator.actions.toggle(article.id)}
                checked={newspaperCreator.actions.isAdded(article.id)}
                class="c-checkbox"
                type="checkbox"
                data-self="center"
              />

              <div
                data-display="flex"
                data-direction="column"
                data-max-width="100%"
                data-overflow="hidden"
              >
                <div
                  data-fs="14"
                  data-transform="truncate"
                  data-width="100%"
                  title={String(article.title)}
                >
                  {article.title}
                </div>
                <UI.OutboundLink
                  href={article.url}
                  data-fs="12"
                  data-transform="truncate"
                  data-width="100%"
                  title={String(article.title)}
                >
                  {article.url}
                </UI.OutboundLink>
              </div>
            </li>
          );
        })}
      </ul>

      {newspaperCreator.selectedArticleIds.length > 0 &&
        newspaperCreator.selectedArticleIds.length <=
          NEWSPAPER_MAX_ARTICLES_NUMBER && (
          <div data-display="flex" data-gap="12">
            <form
              onSubmit={(event) => {
                event.preventDefault();

                return createNewspaper.mutate(
                  newspaperCreator.selectedArticleIds
                );
              }}
            >
              <button type="submit" class="c-button" data-variant="primary">
                {t("newspaper.create")}
              </button>
            </form>

            <button
              onClick={newspaperCreator.actions.clear}
              type="button"
              class="c-button"
              data-variant="bare"
            >
              {t("dashboard.unselect_all")}
            </button>
          </div>
        )}
    </div>
  );
}

function useArticles() {
  const queryClient = useQueryClient();

  const _articles = {
    data: queryClient.getQueryData("articles"),
  } as UseInfiniteQueryResult<bg.Paged<types.ArticleType>>;

  return bg.Pagination.extract(_articles);
}

function useCreateNewspaper(callback: VoidFunction) {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();

  return useMutation(api.createNewspaper, {
    onSuccess: () => {
      queryClient.invalidateQueries("newspapers");
      notify({ message: "newspaper.scheduled" });
      setTimeout(() => queryClient.invalidateQueries("articles"), 500);
      callback();
    },

    onError: (error: ServerError) => notify({ message: t(error.message) }),
  });
}
