import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";

import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";
import { ARTICLE_URL_MAX_CHARS } from "../value-objects/article-url-max-chars";

export function AddArticleForm() {
  const t = bg.useTranslations();

  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();

  const url = bg.useField<types.ArticleType["url"]>("");

  const addArticleRequest = useMutation(api.addArticle, {
    onSuccess: () => {
      url.clear();
      queryClient.invalidateQueries("articles");
      queryClient.invalidateQueries("stats");
      notify({ message: "article.added" });
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  return (
    <form
      data-display="flex"
      data-gap="12"
      data-mt="12"
      data-md-mt="24"
      onSubmit={(event) => {
        event.preventDefault();
        addArticleRequest.mutate({ url: url.value });
      }}
    >
      <input
        id="url"
        name="url"
        type="url"
        inputMode="url"
        required
        value={url.value}
        max={ARTICLE_URL_MAX_CHARS}
        onInput={(event) => url.set(event.currentTarget.value)}
        disabled={addArticleRequest.isLoading}
        placeholder={t("article.placeholder")}
        class="c-input"
        data-grow="1"
      />

      <button
        class="c-button"
        data-variant="secondary"
        type="submit"
        disabled={addArticleRequest.isLoading}
        style={{ minWidth: "60px" }}
      >
        {addArticleRequest.isLoading
          ? t("article.adding_article")
          : t("article.add")}
      </button>

      <UI.ClearButton
        onClick={url.clear}
        disabled={addArticleRequest.isLoading}
      />
    </form>
  );
}
