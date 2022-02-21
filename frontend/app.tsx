import Router from "preact-router";
import { h } from "preact";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastsContextProvider } from "@bgord/frontend";

import { Toasts } from "./toasts";
import { Navigation } from "./navigation";
import { BuildMeta, BuildMetaDataType } from "./build-meta";

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
  InitialSettingsDataType &
  BuildMetaDataType & {
    url: string;
  };

const queryClient = new QueryClient();

export function App(props: InitialDataType) {
  const {
    archiveArticles,
    archiveNewspapers,
    settings,
    BUILD_DATE,
    BUILD_VERSION,
    ...rest
  } = props;

  return (
    <QueryClientProvider client={queryClient}>
      <ToastsContextProvider>
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

        <Toasts />

        <BuildMeta BUILD_VERSION={BUILD_VERSION} BUILD_DATE={BUILD_DATE} />
      </ToastsContextProvider>
    </QueryClientProvider>
  );
}
