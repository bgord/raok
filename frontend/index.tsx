import { h, render } from "preact";

import { App, InitialDataType } from "./app";

// @ts-ignore
const state = window!.__STATE__;

render(
  <App {...(state as InitialDataType)} />,
  document.querySelector("#root") as Element
);
