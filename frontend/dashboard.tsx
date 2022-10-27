import { RoutableProps } from "preact-router";
import { h } from "preact";
import * as bg from "@bgord/frontend";

import * as hooks from "./hooks";
import { ArticleList } from "./article-list";
import { NewspaperList } from "./newspaper-list";
import { Stats } from "./stats";
import { SendArbitraryFile } from "./send-arbitrary-file";
import { FavouriteArticles } from "./favourite-articles";

import * as types from "./types";

export type InitialDashboardDataType = {
  stats: types.StatsType;
  articles: bg.Paged<types.ArticleType>;
  newspapers: types.NewspaperType[];
  favouriteArticles: types.FavouriteArticleType[];
};

export function Dashboard(_: RoutableProps) {
  hooks.useLeavingPrompt();

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
        <NewspaperList />
      </section>

      <section
        data-grow="1"
        data-px="24"
        data-md-px="0"
        data-width="100%"
        data-max-width="528"
        data-md-max-width="unset"
        data-position="sticky"
        data-top="0"
        style="height: 100%;"
      >
        <FavouriteArticles />
        <SendArbitraryFile />
        <Stats />
      </section>
    </main>
  );
}
