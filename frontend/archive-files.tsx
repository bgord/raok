import { RoutableProps } from "preact-router";
import prettyBytes from "pretty-bytes-es5";
import { h } from "preact";
import { useQuery } from "react-query";
import * as bg from "@bgord/frontend";
import { Search } from "iconoir-react";

import * as hooks from "./hooks";
import * as UI from "./ui";
import * as Icons from "./icons";
import * as api from "./api";
import * as types from "./types";
import { TimestampFiltersEnum } from "./filters";

export type InitialArchiveFilesDataType = {
  archiveFiles: types.ArchiveFileType[];
};

export function ArchiveFiles(props: RoutableProps) {
  hooks.useLeavingPrompt();
  const search = bg.useClientSearch();

  const sentAt = bg.useUrlFilter({
    enum: TimestampFiltersEnum,
    defaultQuery: TimestampFiltersEnum.last_3_days,
    label: "sentAt",
  });

  const filters = { sentAt: sentAt.query };
  const archiveFiles = useQuery(["archive-files", filters], () =>
    api.getArchiveFiles(filters)
  );

  const files = (archiveFiles.data ?? []).filter((file) =>
    search.filterFn(String(file.name))
  );

  const numberOfFiles = files.length;

  return (
    <main
      data-display="flex"
      data-direction="column"
      data-mt="24"
      data-mx="auto"
      data-md-pl="6"
      data-md-pr="3"
      data-max-width="768"
      data-md-max-width="100%"
      data-width="100%"
    >
      <div data-display="flex" data-cross="center">
        <h2 data-fs="20" data-color="gray-800" data-fw="500">
          Archive files
        </h2>

        <UI.Badge data-ml="12">{numberOfFiles}</UI.Badge>
      </div>

      <div data-display="flex" data-cross="end" data-mt="12">
        <div
          data-display="flex"
          data-direction="column"
          data-mt="12"
          data-mr="24"
        >
          <label class="c-label" htmlFor="sent-at">
            Sent at
          </label>
          <UI.Select
            id="sent-at"
            name="sent-at"
            value={sentAt.query}
            onInput={sentAt.onChange}
          >
            {sentAt.options.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </UI.Select>
        </div>

        <button
          type="button"
          class="c-button"
          data-variant="bare"
          onClick={sentAt.clear}
        >
          Reset filter
        </button>
      </div>

      <div data-display="flex" data-my="24" data-max-width="100%">
        <div data-position="relative">
          <input
            list="files"
            onInput={search.onChange}
            value={search.query}
            class="c-input"
            placeholder="Search for a file..."
            style="padding-right: 36px"
            data-width="100%"
          />
          <Search
            height="34"
            width="34"
            data-position="absolute"
            data-p="6"
            style="top: 1px; right: 1px; background: white;"
          />
        </div>

        <button
          type="button"
          onClick={search.clear}
          class="c-button"
          data-variant="bare"
          data-px="3"
          data-ml="6"
          data-mr="auto"
        >
          <Icons.Close />
        </button>
      </div>

      {archiveFiles.isSuccess && archiveFiles.data.length === 0 && (
        <div data-fs="14" data-color="gray-700">
          No archive files.
        </div>
      )}

      <datalist id="files">
        {archiveFiles.data?.map((file) => (
          <option value={String(file.name)} />
        ))}
      </datalist>

      <ul
        data-display="flex"
        data-direction="column"
        data-gap="12"
        data-max-width="100%"
      >
        {files.map((file) => (
          <li data-fs="14" data-display="flex" data-max-width="100%">
            <strong
              data-transform="truncate"
              title={file.name}
              data-color="gray-600"
            >
              {file.name}
            </strong>
            <span data-ml="auto" data-mr="24" data-color="gray-400">
              {file.sentAt?.relative}
            </span>
            <span>{prettyBytes(file.size)}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
