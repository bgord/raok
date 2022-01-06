import { h, hydrate } from "preact";

import { App, InitialDataType } from "./app";

// @ts-ignore
const state = window!.__STATE__;

hydrate(
  <App {...(state as InitialDataType)} />,
  document.querySelector("#root") as Element
);
