import { h } from "preact";
import { QueryClient, QueryClientProvider } from "react-query";

import { ArticleList } from "./article-list";
import { NewspaperList } from "./newspaper-list";
import { Stats } from "./stats";
import { SendArbitraryFile } from "./send-arbitrary-file";
import { FavouriteArticles } from "./favourite-articles";

import { StatsType, ArticleType, NewspaperType } from "./types";

const queryClient = new QueryClient();

export type InitialDataType = {
  stats: StatsType;
  articles: ArticleType[];
  newspapers: NewspaperType[];
  favouriteArticles: ArticleType[];
};

export function App(props: InitialDataType) {
  return (
    <QueryClientProvider client={queryClient}>
      <main
        data-display="flex"
        data-mx="auto"
        data-mt="48"
        style="max-width: 1296px"
      >
        <section data-grow="1" data-pr="48" style={{ maxWidth: "528px" }}>
          <Stats initialData={props.stats} />
          <SendArbitraryFile />
          <FavouriteArticles initialData={props.favouriteArticles} />
        </section>

        <div data-max-width="768" data-width="100%">
          <ArticleList initialData={props.articles} />
          <NewspaperList initialData={props.newspapers} />
        </div>
      </main>
    </QueryClientProvider>
  );
}
