import Router from "preact-router";
import { h } from "preact";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  ToastsContextProvider,
  TranslationsContextProvider,
} from "@bgord/frontend";
import type { Schema, TranslationsType } from "@bgord/node";

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
    language: Schema.LanguageType;
    translations: TranslationsType;
  };

const queryClient = new QueryClient();

export function App(props: InitialDataType) {
  const {
    archiveArticles,
    archiveNewspapers,
    settings,
    BUILD_DATE,
    BUILD_VERSION,
    language,
    translations,
    ...rest
  } = props;

  return (
    <QueryClientProvider client={queryClient}>
      <TranslationsContextProvider translations={translations}>
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
      </TranslationsContextProvider>
    </QueryClientProvider>
  );
}
