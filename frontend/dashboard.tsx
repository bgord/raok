import { RoutableProps } from "preact-router";
import { h } from "preact";

import { NotificationsContextProvider } from "./notifications-context";

import { ArticleList } from "./article-list";
import { NewspaperList } from "./newspaper-list";
import { Stats } from "./stats";
import { SendArbitraryFile } from "./send-arbitrary-file";
import { FavouriteArticles } from "./favourite-articles";
import { Notifications } from "./notifications";

import { StatsType, ArticleType, NewspaperType } from "./types";

export type InitialDashboardDataType = {
  stats: StatsType;
  articles: ArticleType[];
  newspapers: NewspaperType[];
  favouriteArticles: ArticleType[];
};

export function Dashboard(props: InitialDashboardDataType & RoutableProps) {
  return (
    <NotificationsContextProvider>
      <main
        data-display="flex"
        data-mx="auto"
        data-mt="48"
        style="max-width: 1296px"
      >
        <section data-grow="1" data-pr="48" style={{ maxWidth: "528px" }}>
          <FavouriteArticles initialData={props.favouriteArticles} />
          <SendArbitraryFile />
          <Stats initialData={props.stats} />
        </section>

        <div data-max-width="768" data-width="100%">
          <ArticleList initialData={props.articles} />
          <NewspaperList initialData={props.newspapers} />
        </div>
      </main>

      <Notifications />
    </NotificationsContextProvider>
  );
}
