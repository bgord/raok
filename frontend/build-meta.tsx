import { h } from "preact";
import * as bg from "@bgord/frontend";

export type BuildMetaDataType = {
  BUILD_DATE: number;
  BUILD_VERSION: string;
};

export function BuildMeta(props: BuildMetaDataType) {
  return (
    <div data-display="flex" data-mr="6" data-fs="12" data-color="gray-400">
      <div data-mx="12">{props.BUILD_VERSION}</div>
      <div>{bg.DateFormatter.datetime(props.BUILD_DATE)}</div>
    </div>
  );
}
