import { h, render } from "preact";
import { useState } from "preact/hooks";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
} from "react-query";

const queryClient = new QueryClient();

type ArticleIdType = string;
type ArticleUrlType = string;
type ArticleStatusType = string;
type ArticleSourceType = string;

type ArticlePayload = { url: ArticleUrlType };

type Article = {
  id: ArticleIdType;
  url: ArticleUrlType;
  status: ArticleStatusType;
  source: ArticleSourceType;
};

function AddArticleForm() {
  const addArticleRequest = useMutation(async (article: ArticlePayload) =>
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

function ArticleList() {
  const state = useQuery(
    ["articles"],
    async (): Promise<Article[]> =>
      fetch("/articles", {
        method: "GET",
        mode: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      }).then((response) => (response.ok ? response.json() : [])),
    { initialData: [] }
  );

  return (
    <section>
      <div data-bg="gray-100" data-bw="1" data-bc="gray-200" data-p="12">
        <h2
          data-fs="16"
          data-color="gray-800"
          data-fw="500"
          data-bw="2"
          data-bcb="gray-200"
          data-pb="6"
        >
          Articles
        </h2>

        <div data-display="flex" data-mt="24">
          <button
            id="select-all"
            type="button"
            class="c-button"
            data-variant="secondary"
            data-mr="12"
          >
            Select all
          </button>
          <button
            id="deselect-all"
            type="button"
            class="c-button"
            data-variant="secondary"
          >
            Deselect all
          </button>

          <form
            id="create-newspaper"
            method="POST"
            action="/create-newspaper"
            data-ml="auto"
          >
            <button type="submit" class="c-button" data-variant="primary">
              Create newspaper
            </button>
          </form>
        </div>
      </div>

      {state.isSuccess && state.data.length === 0 && (
        <small data-md-px="12" data-mt="12" data-ml="6">
          No articles added at the moment
        </small>
      )}

      <ul style={{ "list-style": "none" }} data-mt="24">
        {state.isSuccess &&
          state.data.map((article) => (
            <li
              data-display="flex"
              data-cross="center"
              data-wrap="nowrap"
              data-mb="24"
              data-md-px="6"
            >
              <input
                id="urls"
                name={article.id}
                class="c-checkbox"
                type="checkbox"
                data-mr="12"
              />
              <a
                href={article.url}
                target="_blank"
                class="c-link"
                data-color="gray-700"
                data-mr="12"
                style={{
                  "white-space": "nowrap",
                  overflow: "hidden",
                  "text-overflow": "ellipsis",
                }}
              >
                {article.url}
              </a>

              <strong
                data-transform="uppercase"
                data-color="gray-600"
                data-bg="gray-200"
                data-px="6"
                data-br="4"
                data-ls="1"
                data-fs="12"
                data-ml="auto"
                data-mr="12"
              >
                {article.status}
              </strong>
              <strong
                data-transform="uppercase"
                data-color="gray-600"
                data-bg="gray-200"
                data-px="6"
                data-br="4"
                data-ls="1"
                data-fs="12"
                data-mr="12"
              >
                {article.source}
              </strong>
              <form method="POST" action={`/delete-article/${article.id}`}>
                <button type="submit" class="c-button" data-variant="bare">
                  Delete
                </button>
              </form>
            </li>
          ))}
      </ul>
    </section>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AddArticleForm />
      <ArticleList />
    </QueryClientProvider>
  );
}

render(<App />, document.querySelector("#root") as Element);
