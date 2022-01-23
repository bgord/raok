import Router from "preact-router";
import { h } from "preact";

import { Dashboard, InitialDashboardDataType } from "./dashboard";
import { Archive } from "./archive";

export type InitialDataType = InitialDashboardDataType;

export function App(props: InitialDataType) {
  return (
    <Router>
      <Dashboard {...props} path="/dashboard" />
      <Archive path="/archive" />
    </Router>
  );
}
