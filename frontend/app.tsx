import Router from "preact-router";
import { h } from "preact";
import { QueryClient, QueryClientProvider } from "react-query";

import { Dashboard, InitialDashboardDataType } from "./dashboard";
import { ArchiveArticles, InitialArchiveArticlesDataType } from "./archive-articles";

export type InitialDataType = InitialDashboardDataType & InitialArchiveArticlesDataType;

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
        <Dashboard path="/dashboard" {...rest} />
      </Router>
    </QueryClientProvider>
  );
}
