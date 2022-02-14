import Router from "preact-router";
import { h } from "preact";
import { QueryClient, QueryClientProvider } from "react-query";

import { NotificationsContextProvider } from "./notifications-context";
import { Notifications } from "./notifications";

import { Navigation } from "./navigation";

import { Dashboard, InitialDashboardDataType } from "./dashboard";
import {
  ArchiveArticles,
  InitialArchiveArticlesDataType,
} from "./archive-articles";
import {
  ArchiveNewspapers,
  InitialArchiveNewspapersDataType,
} from "./archive-newspapers";
import { Settings, InitialSettingsDataType } from "./settings";

export type InitialDataType = InitialDashboardDataType &
  InitialArchiveArticlesDataType &
  InitialArchiveNewspapersDataType &
  InitialSettingsDataType & { url: string };

const queryClient = new QueryClient();

export function App(props: InitialDataType) {
  const { archiveArticles, archiveNewspapers, settings, ...rest } = props;

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsContextProvider>
        <Navigation />

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
          <Settings path="/settings" settings={settings} />
        </Router>

        <Notifications />
      </NotificationsContextProvider>
    </QueryClientProvider>
  );
}
