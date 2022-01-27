import { RoutableProps } from "preact-router";
import { h } from "preact";
import { useQuery } from "react-query";

import * as UI from "./ui";
import { api } from "./api";
import { NewspaperType, NewspaperStatusEnum } from "./types";
import { useTimestampFilter, useFilter } from "./hooks";

import { Newspaper } from "./newspaper";

export type InitialArchiveNewspapersDataType = {
  archiveNewspapers: NewspaperType[];
};

export function ArchiveNewspapers(
  props: InitialArchiveNewspapersDataType & RoutableProps
) {
  const archiveNewspapers = useQuery(
    "archive-newspapers",
    api.getArchiveNewspapers,
    { initialData: props.archiveNewspapers }
  );

  const status = useFilter({ enum: NewspaperStatusEnum });
  const sentAt = useTimestampFilter({ defaultValue: "last_3_days" });

  const newspapers = (archiveNewspapers.data ?? [])
    .filter((newspaper) => status.filterFn(newspaper.status))
    .filter((newspaper) => sentAt.filterFn(newspaper.sentAt));

  const numberOfNewspapers = newspapers.length;

  return (
    <main
      data-display="flex"
      data-direction="column"
      data-mx="auto"
      data-my="24"
      data-max-width="768"
      data-width="100%"
    >
      <div
        data-display="flex"
        data-cross="center"
        data-mt="24"
        data-mb="36"
        data-bwt="4"
        data-bct="gray-100"
        data-pt="12"
      >
        <h2 data-fs="20" data-color="gray-800" data-fw="500">
          Archive Newspapers
        </h2>

        <UI.Badge data-ml="12" data-p="3">
          {numberOfNewspapers}
        </UI.Badge>
      </div>

      <div data-display="flex" data-cross="end" data-mb="24">
        <div data-display="flex" data-direction="column" data-mr="24">
          <label class="c-label" for="sent-at">
            Sent at
          </label>
          <div class="c-select-wrapper">
            <select
              id="sent-at"
              name="sent-at"
              class="c-select"
              value={sentAt.query}
              onInput={sentAt.onChange}
            >
              <option selected value="all">
                All
              </option>
              {sentAt.options.map((sentAtOption) => (
                <option value={sentAtOption}>{sentAtOption}</option>
              ))}
            </select>
          </div>
        </div>
        <div data-display="flex" data-direction="column" data-mr="24">
          <label class="c-label" for="status">
            Status
          </label>
          <div class="c-select-wrapper">
            <select
              id="status"
              name="status"
              class="c-select"
              value={status.query}
              onInput={status.onChange}
            >
              <option selected value="all">
                All
              </option>

              {status.options.map((status) => (
                <option value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          class="c-button"
          data-variant="bare"
          onClick={() => {
            sentAt.clear();
            status.clear();
          }}
        >
          Reset
        </button>
      </div>

      {archiveNewspapers.isSuccess && archiveNewspapers.data.length === 0 && (
        <div data-fs="14" data-color="gray-700">
          No archive newspapers.
        </div>
      )}

      <ul
        data-display="flex"
        data-direction="column"
        data-mt="24"
        data-bg="gray-100"
        data-px="12"
      >
        {newspapers.map((newspaper) => (
          <Newspaper key={newspaper.id} {...newspaper} />
        ))}
      </ul>
    </main>
  );
}
