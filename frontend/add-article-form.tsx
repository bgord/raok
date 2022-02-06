import { h } from "preact";
import { useState } from "preact/hooks";
import { useMutation, useQueryClient } from "react-query";

import { ArticleType } from "./types";
import { api } from "./api";
import { useNotificationTrigger } from "./notifications-context";

export function AddArticleForm() {
  const queryClient = useQueryClient();
  const notify = useNotificationTrigger();

  const [url, setUrl] = useState<ArticleType["url"]>("");

  const addArticleRequest = useMutation(api.addArticle, {
    onSuccess: () => {
      setUrl("");
      queryClient.invalidateQueries("articles");
      queryClient.invalidateQueries("stats");
      notify({ type: "success", message: "Article added" });
    },
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
      data-mb="24"
      data-md-mb="36"
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
        {addArticleRequest.isLoading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
