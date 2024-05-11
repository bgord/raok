import * as Icons from "iconoir-react";
import { h, Fragment } from "preact";

import * as UI from "./ui";
import * as types from "./types";

export function SourceQuality(
  props: types.SourceType & h.JSX.IntrinsicElements["li"],
) {
  const isSourceRelevant = (props.quality ?? 0) >= 20;

  return (
    <Fragment>
      <UI.Info data-fw={isSourceRelevant ? "700" : "500"}>
        {props.quality === null || props.quality === undefined
          ? "----"
          : `${props.quality}%`}
      </UI.Info>
      {props.isQualityAlarming && (
        <Icons.WarningTriangle
          data-color="red-600"
          height="18"
          width="18"
          data-shrink="0"
          data-mb="3"
        />
      )}
    </Fragment>
  );
}
