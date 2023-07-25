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

  const scroll = bg.useScroll();

  const displayNonEssentialPanes = scroll.position.value <= 150;

  const [selectedArticleIds, actions] = bg.useList<types.ArticleType["id"]>();

  return (
    <contexts.NewspaperCreatorProvider state={{ selectedArticleIds, actions }}>
      <main
        data-display="flex"
        data-main="center"
        data-mx="auto"
        data-mt="12"
        data-mb="48"
        data-md-mb="72"
        data-max-width="1296"
      >
        <section
          data-width="100%"
          data-mt="6"
          data-px="24"
          data-md-px="0"
          {...bg.Rhythm().times(62).style.maxWidth}
        >
          <ArticleList />
          <NewspaperList />
        </section>

        <section
          data-grow="1"
          data-mt="6"
          data-px="24"
          data-md-px="0"
          data-width="100%"
          data-md-max-width="unset"
          {...bg.Rhythm().times(40).style.maxWidth}
        >
          <CreateNewspaper />
          {displayNonEssentialPanes && <SendArbitraryFile />}
          {displayNonEssentialPanes && <Stats />}
        </section>
      </main>
    </contexts.NewspaperCreatorProvider>
  );
}
