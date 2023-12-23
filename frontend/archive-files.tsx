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

  const fileUrlCopied = bg.useRateLimiter({
    limitMs: bg.Time.Seconds(2).ms,
    action: () => notify({ message: "app.file.url.copied" }),
  });

  const sentAtFilter = bg.useUrlFilter({
    name: "sentAt",
    enum: TimestampFiltersEnum,
    defaultQuery: TimestampFiltersEnum.last_3_days,
  });

  const filters = { sentAt: sentAtFilter.query };
  const archiveFiles = useQuery(api.keys.archiveFiles(filters), () =>
    api.Archive.getFiles(filters)
  );

  const sort = bg.useClientSort<types.ArchiveFileType>("sort-archive-files", {
    enum: types.SourceSortEnum,
    options: {
      [types.ArchiveFilesSortEnum.default]: bg.defaultSortFn,
      [types.ArchiveFilesSortEnum.a_z]: (a, b) => bg.Sorts.aToZ(a.name, b.name),
      [types.ArchiveFilesSortEnum.z_a]: (a, b) => bg.Sorts.zToA(a.name, b.name),
    },
  });

  const files = (archiveFiles.data ?? [])
    .filter((file) => search.filterFn(file.name))
    .sort(sort.sortFn);

  const numberOfFiles = files.length;

  return (
    <main
      data-display="flex"
      data-direction="column"
      data-gap="36"
      data-my="24"
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
            <label class="c-label" {...sentAtFilter.label.props}>
              {t("app.sent_at")}
            </label>
            <UI.Select
              value={sentAtFilter.query}
              onInput={sentAtFilter.onChange}
              {...sentAtFilter.input.props}
            >
              {sentAtFilter.options.map((option) => (
                <option key={option} value={option}>
                  {t(String(option))}
                </option>
              ))}
            </UI.Select>
          </div>

          <div data-display="flex" data-direction="column">
            <label class="c-label" {...sort.label.props}>
              {t("sort")}
            </label>

            <UI.Select
              key={sort.value}
              value={sort.value}
              onInput={sort.handleChange}
              {...sort.input.props}
            >
              {sort.options.map((option) => (
                <option key={option} value={option}>
                  {t(`archive-files.sort.${option}`)}
                </option>
              ))}
            </UI.Select>
          </div>

          <button
            type="button"
            class="c-button"
            data-variant="bare"
            onClick={bg.exec([sentAtFilter.clear, sort.clear])}
            disabled={sentAtFilter.unchanged && sort.unchanged}
          >
            {t("app.reset")}
          </button>
        </div>
      </div>

      <div
        data-display="flex"
        data-wrap="nowrap"
        data-gap="6"
        data-max-width="100%"
      >
        <div data-position="relative" data-width="100%">
          <input
            list="files"
            onInput={search.onChange}
            value={search.query}
            class="c-input"
            placeholder={t("app.files.archive.placeholder")}
            data-width="100%"
          />
          <Icons.Search
            height="34"
            width="34"
            data-position="absolute"
            data-p="6"
            data-top="0"
            data-right="0"
          />
        </div>

        <UI.ClearButton onClick={search.clear} disabled={search.unchanged} />
      </div>

      {archiveFiles.isSuccess && files.length === 0 && (
        <UI.Info>{t("app.files.archive.empty")}</UI.Info>
      )}

      <datalist id="files">
        {archiveFiles.data?.map((file) => (
          <option key={file.id} value={String(file.name)} />
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
            key={file.id}
            data-display="flex"
            data-cross="center"
            data-wrap="nowrap"
            data-md-wrap="wrap"
            data-max-width="100%"
            data-fs="14"
          >
            <UI.Title title={file.name} data-mr="12">
              {file.name}
            </UI.Title>

            <div
              data-display="flex"
              data-gap="12"
              data-cross="center"
              data-wrap="nowrap"
              data-ml="auto"
            >
              <UI.Info
                data-ml="auto"
                data-transform="nowrap"
                data-color="gray-400"
                title={bg.DateFormatter.datetime(file.sentAt?.raw)}
              >
                {file.sentAt?.relative}
              </UI.Info>

              <UI.Info data-transform="nowrap">
                {prettyBytes(file.size)}
              </UI.Info>

              <UI.CopyButton
                options={{
                  text: getFileDownloadUrl(file.id),
                  onSuccess: fileUrlCopied,
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
                data-mb="3"
                title={t("app.file.download")}
              >
                <Icons.Download width="24" height="24" />
              </bg.OutboundLink>
            </div>
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
