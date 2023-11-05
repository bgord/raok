import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";

import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";

export function AddArticleForm() {
  const t = bg.useTranslations();

  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();

  const url = bg.useField<types.ArticleType["url"]>("article-url", "");

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
        autofocus
        type="url"
        inputMode="url"
        required
        value={url.value}
        max={types.ARTICLE_URL_MAX_CHARS}
        onInput={(event) => url.set(event.currentTarget.value)}
        disabled={addArticleRequest.isLoading}
        placeholder={t("article.placeholder")}
        class="c-input"
        data-grow="1"
        {...url.input.props}
      />

      <button
        class="c-button"
        data-variant="secondary"
        type="submit"
        disabled={addArticleRequest.isLoading}
        {...bg.Rhythm().times(5).style.minWidth}
      >
        {addArticleRequest.isLoading
          ? t("article.adding_article")
          : t("article.add")}
      </button>

      <UI.ClearButton
        onClick={url.clear}
        disabled={url.unchanged || addArticleRequest.isLoading}
      />
    </form>
  );
}
