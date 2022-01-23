import Router from "preact-router";
import { h } from "preact";
import { QueryClient, QueryClientProvider } from "react-query";

import { Dashboard, InitialDashboardDataType } from "./dashboard";
import { Archive, InitialArchiveDataType } from "./archive";

export type InitialDataType = InitialDashboardDataType & InitialArchiveDataType;

const queryClient = new QueryClient();

export function App(props: InitialDataType) {
  const { archiveArticles, ...rest } = props;

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Archive path="/archive" archiveArticles={archiveArticles} />
        <Dashboard path="/dashboard" {...rest} />
      </Router>
    </QueryClientProvider>
  );
}
