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
import { BuildMetaDataType } from "./build-meta";

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
import { Review } from "./review";

export type InitialDataType = InitialDashboardDataType &
  InitialArchiveArticlesDataType &
  InitialArchiveNewspapersDataType &
  InitialSettingsDataType &
  BuildMetaDataType & {
    url: string;
    language: Schema.LanguageType;
    translations: TranslationsType;
  };

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnMount: false } },
});

export function App(props: InitialDataType) {
  queryClient.setQueryData("articles", {
    pages: [props.articles],
    pageParams: [1],
  });
  queryClient.setQueryData("newspapers", props.newspapers);
  queryClient.setQueryData("favourite-articles", props.favouriteArticles);
  queryClient.setQueryData("stats", props.stats);
  queryClient.setQueryData("archive-articles", props.archiveArticles);
  queryClient.setQueryData("archive-newspapers", props.archiveNewspapers);
  queryClient.setQueryData("settings", props.settings);

  return (
    <QueryClientProvider client={queryClient}>
      <TranslationsContextProvider translations={props.translations}>
        <ToastsContextProvider>
          <Navigation />

          <Router url={props.url}>
            <ArchiveArticles path="/archive/articles" />
            <ArchiveNewspapers path="/archive/newspapers" />
            <Dashboard path="/dashboard" />
            <Settings path="/settings" />
            <Review path="/review" articles={props.articles} />
          </Router>

          <Toasts />
        </ToastsContextProvider>
      </TranslationsContextProvider>
    </QueryClientProvider>
  );
}
