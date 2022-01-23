import Router from "preact-router";
import { h } from "preact";
import { QueryClient, QueryClientProvider } from "react-query";

import { Dashboard, InitialDashboardDataType } from "./dashboard";
import { Archive } from "./archive";

export type InitialDataType = InitialDashboardDataType;

const queryClient = new QueryClient();

export function App(props: InitialDataType) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Dashboard {...props} path="/dashboard" />
        <Archive path="/archive" />
      </Router>
    </QueryClientProvider>
  );
}
