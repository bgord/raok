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

  const ref = bg.useFocusKeyboardShortcut("$mod+Control+KeyA");

  const addArticleRequest = useMutation(api.Article.add, {
    onSuccess: () => {
      url.clear();
      queryClient.invalidateQueries(api.keys.articles);
      queryClient.invalidateQueries(api.keys.stats);
      notify({ message: "article.added" });
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  return (
    <form
      data-display="flex"
      data-gap="12"
      data-md-gap="6"
      data-mt="12"
      data-md-mt="3"
      onSubmit={(event) => {
        event.preventDefault();
        addArticleRequest.mutate({ url: url.value });
      }}
    >
      <input
        autofocus
        ref={ref}
        class="c-input"
        data-grow="1"
        type="url"
        inputMode="url"
        placeholder={t("article.placeholder")}
        value={url.value}
        onChange={url.handleChange}
        {...bg.Form.pattern(types.ArticleUrlValidations)}
        {...url.input.props}
      />

      <button
        class="c-button"
        data-variant="secondary"
        type="submit"
        disabled={addArticleRequest.isLoading || url.unchanged}
        {...bg.Rhythm().times(5).style.minWidth}
      >
        {addArticleRequest.isLoading
          ? t("article.adding_article")
          : t("article.add")}
      </button>

      <UI.ClearButton
        onClick={url.clear}
        disabled={addArticleRequest.isLoading || url.unchanged}
      />
    </form>
  );
}
