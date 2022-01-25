import Router from "preact-router";
import { h } from "preact";
import { QueryClient, QueryClientProvider } from "react-query";

import { Dashboard, InitialDashboardDataType } from "./dashboard";
import {
  ArchiveArticles,
  InitialArchiveArticlesDataType,
} from "./archive-articles";
import { ArchiveNewspapers } from "./archive-newspapers";

export type InitialDataType = InitialDashboardDataType &
  InitialArchiveArticlesDataType;

const queryClient = new QueryClient();

export function App(props: InitialDataType) {
  const { archiveArticles, ...rest } = props;

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ArchiveArticles
          path="/archive/articles"
          archiveArticles={archiveArticles}
        />
        <ArchiveNewspapers path="/archive/newspapers" />
        <Dashboard path="/dashboard" {...rest} />
      </Router>
    </QueryClientProvider>
  );
}
