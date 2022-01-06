import { h, render } from "preact";
import { QueryClient, QueryClientProvider } from "react-query";

import { AddArticleForm } from "./add-article-form";
import { ArticleList } from "./article-list";
import { NewspaperList } from "./newspaper-list";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AddArticleForm />
      <ArticleList />
      <NewspaperList />
    </QueryClientProvider>
  );
}

render(<App />, document.querySelector("#root") as Element);
