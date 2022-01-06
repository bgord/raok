import { h } from "preact";
import { QueryClient, QueryClientProvider } from "react-query";

import { AddArticleForm } from "./add-article-form";
import { ArticleList } from "./article-list";
import { NewspaperList } from "./newspaper-list";
import { Stats } from "./stats";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main
        data-display="flex"
        data-mx="auto"
        data-mt="48"
        style="max-width: 1296px"
      >
        <section data-grow="1" data-pr="48">
          <AddArticleForm />
          <Stats />
        </section>

        <div data-max-width="768" data-width="100%">
          <ArticleList />
          <NewspaperList />
        </div>
      </main>
    </QueryClientProvider>
  );
}
