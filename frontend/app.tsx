import Router from "preact-router";
import { h } from "preact";
import { QueryClient, QueryClientProvider } from "react-query";
import * as bg from "@bgord/frontend";
import type { Schema, TranslationsType } from "@bgord/node";
import { SkipNavLink, SkipNavContent } from "@reach/skip-nav";

import { Toasts } from "./toasts";
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
import { ArchiveFiles, InitialArchiveFilesDataType } from "./archive-files";
import { Sources, InitialSourcesDataType } from "./sources";

import { ScrollButton } from "./scroll-button";

export type InitialDataType = InitialDashboardDataType &
  InitialSourcesDataType &
  InitialArchiveArticlesDataType &
  InitialArchiveNewspapersDataType &
  InitialSettingsDataType &
  InitialArchiveFilesDataType & {
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
  queryClient.setQueryData("stats", props.stats);
  queryClient.setQueryData("archive-articles", props.archiveArticles);
  queryClient.setQueryData("archive-newspapers", props.archiveNewspapers);
  queryClient.setQueryData("archive-files", props.archiveFiles);
  queryClient.setQueryData("settings", props.settings);
  queryClient.setQueryData("articles-search", []);
  queryClient.setQueryData("sources", props.sources);

  return (
    <QueryClientProvider client={queryClient}>
      <bg.TranslationsContextProvider
        value={{ translations: props.translations, language: props.language }}
      >
        <bg.ToastsContextProvider>
          <SkipNavLink as="a" />
          <Navigation />
          <SkipNavContent as="div" />

          <Router url={props.url}>
            <Sources path="/sources" />
            <ArchiveArticles path="/archive/articles" />
            <ArchiveNewspapers path="/archive/newspapers" />
            <ArchiveFiles path="/archive/files" />
            <Dashboard path="/dashboard" />
            <Settings path="/settings" />
          </Router>

          <ScrollButton />
          <Toasts />
        </bg.ToastsContextProvider>
      </bg.TranslationsContextProvider>
    </QueryClientProvider>
  );
}
