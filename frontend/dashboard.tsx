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
        data-main="center"
        data-mx="auto"
        data-my="48"
        data-wrap="wrap-reverse"
        style="max-width: 1296px"
      >
        <section
          data-width="100%"
          data-grow="1"
          data-md-pr="0"
          data-pr="48"
          data-md-mx="12"
          style={{ maxWidth: "528px" }}
        >
          <FavouriteArticles initialData={props.favouriteArticles} />
          <SendArbitraryFile />
          <Stats initialData={props.stats} />
        </section>

        <div data-max-width="768" data-width="100%" data-md-mx="12">
          <ArticleList initialData={props.articles} />
          <NewspaperList initialData={props.newspapers} />
        </div>
      </main>

      <Notifications />
    </NotificationsContextProvider>
  );
}
