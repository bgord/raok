import Router from "preact-router";
import { h } from "preact";
import { QueryClient, QueryClientProvider } from "react-query";

import { NotificationsContextProvider } from "./notifications-context";
import { Notifications } from "./notifications";
import { Dashboard, InitialDashboardDataType } from "./dashboard";
import {
  ArchiveArticles,
  InitialArchiveArticlesDataType,
} from "./archive-articles";
import {
  ArchiveNewspapers,
  InitialArchiveNewspapersDataType,
} from "./archive-newspapers";

export type InitialDataType = InitialDashboardDataType &
  InitialArchiveArticlesDataType &
  InitialArchiveNewspapersDataType & { url: string };

const queryClient = new QueryClient();

export function App(props: InitialDataType) {
  const { archiveArticles, archiveNewspapers, ...rest } = props;

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsContextProvider>
        <Router url={props.url}>
          <ArchiveArticles
            path="/archive/articles"
            archiveArticles={archiveArticles}
          />
          <ArchiveNewspapers
            path="/archive/newspapers"
            archiveNewspapers={archiveNewspapers}
          />
          <Dashboard path="/dashboard" {...rest} />
        </Router>

        <Notifications />
      </NotificationsContextProvider>
    </QueryClientProvider>
  );
}
