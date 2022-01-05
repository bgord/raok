import { h, render } from "preact";
import { useState } from "preact/hooks";

import { QueryClient, QueryClientProvider, useMutation } from "react-query";

const queryClient = new QueryClient();

type ArticleUrlType = string;
type Article = { url: ArticleUrlType };

function AddArticleForm() {
  const addArticleRequest = useMutation(async (article: Article) =>
    fetch("/add-article", {
      method: "POST",
      mode: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      body: JSON.stringify(article),
    })
  );

  const [url, setUrl] = useState<ArticleUrlType>("");

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AddArticleForm />
    </QueryClientProvider>
  );
}

render(<App />, document.querySelector("#root") as Element);
