import { RoutableProps } from "preact-router";
import { h } from "preact";
import * as bg from "@bgord/frontend";

import * as hooks from "./hooks";
import * as contexts from "./contexts";

import { ArticleList } from "./article-list";
import { NewspaperList } from "./newspaper-list";
import { Stats } from "./stats";
import { SendArbitraryFile } from "./send-arbitrary-file";
import { CreateNewspaper } from "./create-newspaper";

import * as types from "./types";

export type InitialDashboardDataType = {
  stats: types.StatsType;
  articles: bg.Paged<types.ArticleType>;
  newspapers: types.NewspaperType[];
};

export function Dashboard(_: RoutableProps) {
  hooks.useLeavingPrompt();

  const newspaperCreator = bg.useList<types.ArticleType["id"]>();

  return (
    <contexts.NewspaperCreatorProvider state={newspaperCreator}>
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
          <SendArbitraryFile />
          <CreateNewspaper />
          <Stats />
        </section>
      </main>
    </contexts.NewspaperCreatorProvider>
  );
}
