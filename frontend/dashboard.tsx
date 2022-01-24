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
        data-max-width="1296"
      >
        <section
          data-grow="1"
          data-pr="48"
          data-md-px="12"
          data-width="100%"
          data-max-width="528"
        >
          <FavouriteArticles initialData={props.favouriteArticles} />
          <SendArbitraryFile />
          <Stats initialData={props.stats} />
        </section>

        <section data-max-width="768" data-width="100%" data-md-px="12">
          <ArticleList initialData={props.articles} />
          <NewspaperList initialData={props.newspapers} />
        </section>
      </main>

      <Notifications />
    </NotificationsContextProvider>
  );
}
