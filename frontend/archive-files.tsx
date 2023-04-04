import { RoutableProps } from "preact-router";
import prettyBytes from "pretty-bytes-es5";
import { h } from "preact";
import { useQuery } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as hooks from "./hooks";
import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";
import { TimestampFiltersEnum } from "./filters";

export type InitialArchiveFilesDataType = {
  archiveFiles: types.ArchiveFileType[];
};

export function ArchiveFiles(_props: RoutableProps) {
  hooks.useLeavingPrompt();
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const search = bg.useClientSearch();

  const sentAtFilter = bg.useUrlFilter({
    enum: TimestampFiltersEnum,
    defaultQuery: TimestampFiltersEnum.last_3_days,
    label: "sentAt",
  });

  const filters = { sentAt: sentAtFilter.query };
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
      data-gap="36"
      data-mt="24"
      data-mx="auto"
      data-md-pl="6"
      data-md-pr="3"
      data-max-width="768"
      data-md-max-width="100%"
      data-width="100%"
    >
      <div data-display="flex" data-gap="12" data-cross="center">
        <h2 data-fs="20" data-color="gray-800" data-fw="500">
          {t("app.files.archive")}
        </h2>

        <UI.Badge>{numberOfFiles}</UI.Badge>
      </div>

      <div
        data-display="flex"
        data-main="between"
        data-cross="end"
        data-gap="24"
      >
        <div data-display="flex" data-cross="end" data-gap="24">
          <div data-display="flex" data-direction="column">
            <label class="c-label" htmlFor={sentAtFilter.label}>
              {t("app.sent_at")}
            </label>
            <UI.Select
              id={sentAtFilter.label}
              name={sentAtFilter.label}
              value={sentAtFilter.query}
              onInput={sentAtFilter.onChange}
            >
              {sentAtFilter.options.map((option) => (
                <option value={option}>{t(option)}</option>
              ))}
            </UI.Select>
          </div>

          <button
            type="button"
            class="c-button"
            data-variant="bare"
            onClick={sentAtFilter.clear}
          >
            {t("app.reset")}
          </button>
        </div>
      </div>

      <div
        data-display="flex"
        data-wrap="nowrap"
        data-gap="12"
        data-max-width="100%"
      >
        <div data-position="relative" data-width="100%">
          <input
            list="files"
            onInput={search.onChange}
            value={search.query}
            class="c-input"
            placeholder={t("app.files.archive.placeholder")}
            style="padding-right: 36px"
            data-width="100%"
          />
          <Icons.Search
            height="34"
            width="34"
            data-position="absolute"
            data-p="6"
            style="top: 1px; right: 1px; background: white;"
          />
        </div>

        <UI.ClearButton onClick={search.clear} />
      </div>

      {archiveFiles.isSuccess && files.length === 0 && (
        <UI.Info>{t("app.files.archive.empty")}</UI.Info>
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
          <li
            data-display="flex"
            data-cross="center"
            data-wrap="nowrap"
            data-md-wrap="wrap"
            data-gap="12"
            data-max-width="100%"
            data-fs="14"
          >
            <strong
              data-transform="truncate"
              title={file.name}
              data-color="gray-600"
            >
              {file.name}
            </strong>

            <span data-ml="auto" data-color="gray-400">
              {file.sentAt?.relative}
            </span>

            <span data-transform="nowrap">{prettyBytes(file.size)}</span>

            <UI.CopyButton
              options={{
                text: getFileDownloadUrl(file.id),
                onSuccess: () => notify({ message: "file.url.copied" }),
              }}
            />

            <bg.OutboundLink
              href={getFileDownloadUrl(file.id)}
              class="c-link"
              data-variant="bare"
              data-display="flex"
              data-color="black"
              data-transform="uppercase"
              data-fw="700"
              title={t("app.file.download")}
            >
              <Icons.Download width="24" height="24" />
            </bg.OutboundLink>
          </li>
        ))}
      </ul>
    </main>
  );
}

function getFileDownloadUrl(id: types.ArchiveFileType["id"]) {
  const safeWindow = bg.getSafeWindow();

  return `${safeWindow?.location.host}/files/archive/${id}/download`;
}
