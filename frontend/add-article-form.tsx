import { h } from "preact";
import { useState } from "preact/hooks";
import { useMutation, useQueryClient } from "react-query";

import { ArticleType, ArticlePayloadType } from "./types";

export function AddArticleForm() {
  const queryClient = useQueryClient();
  const [url, setUrl] = useState<ArticleType["url"]>("");

  const addArticleRequest = useMutation(
    async (article: ArticlePayloadType) =>
      fetch("/add-article", {
        method: "POST",
        mode: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        body: JSON.stringify(article),
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["articles"]);
        setUrl("");
      },
    }
  );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        addArticleRequest.mutate({ url });
      }}
      data-mb="48"
    >
      <div data-display="flex" data-cross="end">
        <div
          data-display="flex"
          data-direction="column"
          data-mr="12"
          data-grow="1"
        >
          <label class="c-label" for="url" data-mb="6">
            Article URL
          </label>
          <input
            id="url"
            name="url"
            type="url"
            required
            value={url}
            onInput={(event) => setUrl(event.currentTarget.value)}
            placeholder="https://example.com/blogpost"
            class="c-input"
            data-grow="1"
          />
        </div>
        <button class="c-button" data-variant="secondary" type="submit">
          Add
        </button>
      </div>
    </form>
  );
}
