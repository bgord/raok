import { RoutableProps } from "preact-router";
import { h } from "preact";

import { ArticleList } from "./article-list";
import { NewspaperList } from "./newspaper-list";
import { Stats } from "./stats";
import { SendArbitraryFile } from "./send-arbitrary-file";
import { FavouriteArticles } from "./favourite-articles";

import {
  StatsType,
  ArticleType,
  FavouriteArticleType,
  NewspaperType,
} from "./types";

export type InitialDashboardDataType = {
  stats: StatsType;
  articles: ArticleType[];
  newspapers: NewspaperType[];
  favouriteArticles: FavouriteArticleType[];
};

export function Dashboard(props: InitialDashboardDataType & RoutableProps) {
  return (
    <main
      data-display="flex"
      data-main="center"
      data-mx="auto"
      data-my="48"
      data-md-mt="12"
      data-md-mb="72"
      data-max-width="1296"
    >
      <section
        data-max-width="768"
        data-width="100%"
        data-px="24"
        data-md-px="0"
      >
        <ArticleList />
        <NewspaperList initialData={props.newspapers} />
      </section>

      <section
        data-grow="1"
        data-pt="12"
        data-px="24"
        data-md-px="0"
        data-width="100%"
        data-max-width="528"
        data-md-max-width="unset"
        data-position="sticky"
        data-top="0"
        style="height: 100%;"
      >
        <FavouriteArticles initialData={props.favouriteArticles} />
        <SendArbitraryFile />
        <Stats />
      </section>
    </main>
  );
}
