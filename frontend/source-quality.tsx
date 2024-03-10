import { h } from "preact";

import * as UI from "./ui";
import * as types from "./types";

export function SourceQuality(
  props: types.SourceType & h.JSX.IntrinsicElements["li"]
) {
  const isSourceRelevant = (props.quality ?? 0) >= 20;

  return (
    <UI.Info data-fw={isSourceRelevant ? "700" : "500"}>
      {props.quality === null || props.quality === undefined
        ? `----`
        : `${props.quality}%`}
    </UI.Info>
  );
}
