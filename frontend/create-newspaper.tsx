import { h } from "preact";
import {
  useQueryClient,
  UseInfiniteQueryResult,
  useMutation,
} from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import { NEWSPAPER_MAX_ARTICLES_NUMBER } from "../value-objects/newspaper-max-articles-number";
import * as api from "./api";
import * as types from "./types";
import * as contexts from "./contexts";
import * as UI from "./ui";

export function CreateNewspaper() {
  const t = bg.useTranslations();

  const articles = useArticles();

  const [selectedArticleIds, actions] = contexts.useNewspaperCreator();

  const createNewspaper = useCreateNewspaper(actions.clear);

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

      {selectedArticleIds.length > 0 && (
        <div data-color="gray-700" data-fs="14">
          {t("articles.selected", {
            selected: selectedArticleIds.length,
            max: NEWSPAPER_MAX_ARTICLES_NUMBER,
          })}
        </div>
      )}

      {selectedArticleIds.length === 0 && (
        <div data-color="gray-700" data-fs="14">
          {t("articles.select_prompt", { max: 5 })}
        </div>
      )}

      <ul
        data-display="flex"
        data-direction="column"
        data-gap="12"
        data-my="12"
      >
        {selectedArticleIds.map((id) => {
          const article = articles.find((article) => article.id === id);

          return <li data-display="flex">{article?.title}</li>;
        })}
      </ul>

      {selectedArticleIds.length > 0 && (
        <div data-display="flex" data-gap="12">
          <form
            onSubmit={(event) => {
              event.preventDefault();

              return createNewspaper.mutate(selectedArticleIds);
            }}
          >
            <button type="submit" class="c-button" data-variant="primary">
              {t("newspaper.create")}
            </button>
          </form>

          <button
            onClick={actions.clear}
            type="button"
            class="c-button"
            data-variant="secondary"
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
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();

  return useMutation(api.createNewspaper, {
    onSuccess: () => {
      queryClient.invalidateQueries("newspapers");
      notify({ message: "newspaper.scheduled" });
      setTimeout(() => queryClient.invalidateQueries("articles"), 500);
      callback();
    },
  });
}
