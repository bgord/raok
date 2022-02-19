import { h } from "preact";

export type BuildMetaDataType = {
  BUILD_DATE: number;
  BUILD_VERSION: string;
};

export function BuildMeta(props: BuildMetaDataType) {
  return (
    <div
      data-position="fixed"
      data-bottom="0"
      data-left="0"
      data-display="flex"
      data-mr="6"
      data-fs="12"
      data-color="gray-400"
    >
      <div data-mx="12">{props.BUILD_VERSION}</div>
      <div>{new Date(props.BUILD_DATE).toLocaleString()}</div>
    </div>
  );
}
