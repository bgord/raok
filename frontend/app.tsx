import Router from "preact-router";
import { h } from "preact";
import { QueryClient, QueryClientProvider } from "react-query";
import * as bg from "@bgord/frontend";
import type { Schema, TranslationsType } from "@bgord/node";
import { SkipNavLink, SkipNavContent } from "@reach/skip-nav";

import * as api from "./api";
import { Toasts } from "./toasts";
import { Navigation } from "./navigation";

import { Dashboard, InitialDashboardDataType } from "./dashboard";
import {
  ArchiveArticles,
  InitialArchiveArticlesDataType,
} from "./archive-articles";
import { Settings, InitialSettingsDataType } from "./settings";
import { ArchiveFiles, InitialArchiveFilesDataType } from "./archive-files";
import { Sources, InitialSourcesDataType } from "./sources";
import { TimestampFiltersEnum } from "./filters";

import { ScrollButton } from "./scroll-button";

export type InitialDataType = InitialDashboardDataType &
  InitialSourcesDataType &
  InitialArchiveArticlesDataType &
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
  queryClient.setQueryData(api.keys.articles, {
    pages: [props.articles],
    pageParams: [1],
  });
  queryClient.setQueryData(api.keys.newspapers, props.newspapers);
  queryClient.setQueryData(api.keys.stats, props.stats);
  queryClient.setQueryData(api.keys.allArchiveArticles, {
    pages: [props.archiveArticles],
    pageParams: [1],
  });
  queryClient.setQueryData(
    api.keys.archiveFiles({ sentAt: TimestampFiltersEnum.last_3_days }),
    props.archiveFiles
  );
  queryClient.setQueryData(api.keys.settings, props.settings);
  queryClient.setQueryData(api.keys.articlesSearch, []);
  queryClient.setQueryData(api.keys.sources, props.sources);

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
