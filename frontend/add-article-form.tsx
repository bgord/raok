import { h } from "preact";
import { useState } from "preact/hooks";
import { useMutation, useQueryClient } from "react-query";
import { useToastTrigger, useTranslations } from "@bgord/frontend";

import * as api from "./api";
import { ServerError } from "./server-error";
import { ArticleType } from "./types";

export function AddArticleForm() {
  const t = useTranslations();

  const queryClient = useQueryClient();
  const notify = useToastTrigger();

  const [url, setUrl] = useState<ArticleType["url"]>("");

  const addArticleRequest = useMutation(api.addArticle, {
    onSuccess: () => {
      setUrl("");
      queryClient.invalidateQueries("articles");
      queryClient.invalidateQueries("stats");
      notify({ message: "article.added" });
    },
    onError: (error: ServerError) => notify({ message: t(error.message) }),
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        addArticleRequest.mutate({ url });
      }}
      data-display="flex"
      data-mt="12"
      data-md-mt="24"
    >
      <input
        id="url"
        name="url"
        type="url"
        required
        value={url}
        onInput={(event) => setUrl(event.currentTarget.value)}
        disabled={addArticleRequest.isLoading}
        placeholder="https://example.com/blogpost"
        class="c-input"
        data-mr="12"
        data-md-mr="6"
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
    </form>
  );
}
