import { h } from "preact";
import { useState } from "preact/hooks";
import { useMutation, useQueryClient } from "react-query";

import { ArticleType } from "./types";
import { api } from "./api";

export function AddArticleForm() {
  const queryClient = useQueryClient();
  const [url, setUrl] = useState<ArticleType["url"]>("");

  const addArticleRequest = useMutation(api.addArticle, {
    onSuccess: () => {
      queryClient.invalidateQueries(["articles"]);
      queryClient.invalidateQueries(["stats"]);
      setUrl("");
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        addArticleRequest.mutate({ url });
      }}
      data-mt="12"
      data-my="24"
    >
      <div data-display="flex" data-cross="end">
        <div
          data-display="flex"
          data-direction="column"
          data-mr="12"
          data-grow="1"
        >
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
            disabled={addArticleRequest.isLoading}
          />
        </div>
        <button
          class="c-button"
          data-variant="secondary"
          type="submit"
          disabled={addArticleRequest.isLoading}
          style={{ width: "105px" }}
        >
          {addArticleRequest.isLoading ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
}
