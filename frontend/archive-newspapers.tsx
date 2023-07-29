import { RoutableProps } from "preact-router";
import { h } from "preact";
import { useQuery } from "react-query";
import * as bg from "@bgord/frontend";

import * as hooks from "./hooks";
import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";
import { TimestampFiltersEnum } from "./filters";

import { Newspaper } from "./newspaper";

export type InitialArchiveNewspapersDataType = {
  archiveNewspapers: types.NewspaperType[];
};

export function ArchiveNewspapers(_props: RoutableProps) {
  hooks.useLeavingPrompt();
  const t = bg.useTranslations();

  const statusFilter = bg.useUrlFilter({
    enum: types.NewspaperStatusEnum,
    name: "status",
  });

  const sentAtFilter = bg.useUrlFilter({
    enum: TimestampFiltersEnum,
    defaultQuery: TimestampFiltersEnum.last_3_days,
    name: "sentAt",
  });

  const filters = { status: statusFilter.query, sentAt: sentAtFilter.query };

  const archiveNewspapers = useQuery(["archive-newspapers", filters], () =>
    api.getArchiveNewspapers(filters)
  );

  const newspapers = archiveNewspapers.data ?? [];
  const numberOfNewspapers = newspapers.length;

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
          {t("newspapers.archive")}
        </h2>

        <UI.Badge>{numberOfNewspapers}</UI.Badge>
      </div>

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
            {sentAtFilter.options.map((sentAtOption) => (
              <option value={sentAtOption}>{t(String(sentAtOption))}</option>
            ))}
          </UI.Select>
        </div>

        <div data-display="flex" data-direction="column">
          <label class="c-label" {...statusFilter.label.props}>
            {t("app.status")}
          </label>
          <UI.Select
            value={statusFilter.query}
            onInput={statusFilter.onChange}
            {...statusFilter.input.props}
          >
            <option selected>{t("all")}</option>
            {statusFilter.options.map((status) => (
              <option value={status}>{t(`newspaper.status.${status}`)}</option>
            ))}
          </UI.Select>
        </div>

        <button
          type="button"
          class="c-button"
          data-variant="bare"
          onClick={() => {
            sentAtFilter.clear();
            statusFilter.clear();
          }}
        >
          {t("app.reset")}
        </button>
      </div>

      {archiveNewspapers.isSuccess && archiveNewspapers.data.length === 0 && (
        <UI.Info>{t("newspapers.archive.empty")}</UI.Info>
      )}

      <ul
        data-display="flex"
        data-direction="column"
        data-bg="gray-100"
        data-px="12"
        data-md-px="0"
        data-max-width="768"
        data-width="100%"
        data-mb="24"
      >
        {newspapers.map((newspaper) => (
          <Newspaper key={newspaper.id} {...newspaper} />
        ))}
      </ul>
    </main>
  );
}
