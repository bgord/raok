import Router from "preact-router";
import { h } from "preact";
import { QueryClient, QueryClientProvider } from "react-query";
import * as bg from "@bgord/frontend";
import type { Schema, TranslationsType } from "@bgord/node";
import { SkipNavLink, SkipNavContent } from "@reach/skip-nav";

import * as types from "./types";
import * as api from "./api";
import { Toasts } from "./toasts";
import { Navigation } from "./navigation";

import { Dashboard, InitialDashboardDataType } from "./dashboard";
import {
  ArchiveArticles,
  InitialArchiveArticlesDataType,
} from "./archive-articles";
import { Settings } from "./settings";
import { ArchiveFiles, InitialArchiveFilesDataType } from "./archive-files";
import { Sources, InitialSourcesDataType } from "./sources";
import { TimestampFiltersEnum } from "./filters";

/** @public */
export type InitialDataType = InitialDashboardDataType &
  InitialSourcesDataType &
  InitialArchiveArticlesDataType &
  InitialArchiveFilesDataType & {
    url: string;
    language: Schema.LanguageType;
    translations: TranslationsType;
    email: types.EmailType;
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
    props.archiveFiles,
  );
  queryClient.setQueryData(api.keys.articlesSearch, []);
  queryClient.setQueryData(api.keys.sources, props.sources);
  queryClient.setQueryData(api.keys.allDevices, props.devices);

  return (
    <QueryClientProvider client={queryClient}>
      <bg.TranslationsContextProvider
        value={{ translations: props.translations, language: props.language }}
      >
        <bg.ToastsContextProvider>
          <SkipNavLink as="a" />
          <Navigation email={props.email} />
          <SkipNavContent as="div" />

          <Router url={props.url}>
            <Sources path="/sources" />
            <ArchiveArticles path="/archive/articles" />
            <ArchiveFiles path="/archive/files" />
            <Dashboard path="/dashboard" />
            <Settings path="/settings" />
          </Router>

          <Toasts />
        </bg.ToastsContextProvider>
      </bg.TranslationsContextProvider>
    </QueryClientProvider>
  );
}
