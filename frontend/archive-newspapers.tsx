import { RoutableProps } from "preact-router";
import { h } from "preact";
import { useQuery } from "react-query";

import { api } from "./api";
import { NewspaperType, NewspaperStatusEnum } from "./types";
import { useFilter } from "./hooks";

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
  const sentAt = useSentAtFilter();

  return (
    <main
      data-display="flex"
      data-direction="column"
      data-mx="auto"
      data-mt="24"
      data-max-width="768"
      data-width="100%"
    >
      <h2
        data-mt="24"
        data-mb="36"
        data-pt="12"
        data-fs="20"
        data-color="gray-800"
        data-bwt="4"
        data-bct="gray-100"
        data-fw="500"
        data-width="100%"
      >
        Archive Newspapers
      </h2>

      <div data-display="flex" data-cross="end" data-mb="24">
        <div data-display="flex" data-direction="column" data-mr="36">
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
        <div data-display="flex" data-direction="column">
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
      </div>

      {archiveNewspapers.isSuccess && archiveNewspapers.data.length === 0 && (
        <div data-fs="14" data-color="gray-700">
          No archive newspapers.
        </div>
      )}

      <ul data-display="flex" data-direction="column" data-mt="24" data-pb="24">
        {archiveNewspapers.data
          ?.filter((newspaper) => status.filterFn(newspaper.status))
          ?.filter((newspaper) => sentAt.filterFn(newspaper.sentAt))
          .map((newspaper) => (
            <Newspaper key={newspaper.id} {...newspaper} />
          ))}
      </ul>
    </main>
  );
}

function useSentAtFilter() {
  enum SentAtFiltersEnum {
    today = "today",
    last_3_days = "last_3_days",
    last_week = "last_week",
    last_30_days = "last_30_days",
  }

  const sentAt = useFilter<NewspaperType["sentAt"]>({
    enum: SentAtFiltersEnum,
    filterFn: (value) => {
      if (sentAt.query === "all") return true;

      if (!value) return false;

      const timeSinceSent = Date.now() - value;

      const DAY = 24 * 60 * 60 * 1000;
      if (sentAt.query === "today") return timeSinceSent <= DAY;

      const THREE_DAYS = 3 * DAY;
      if (sentAt.query === "last_3_days") return timeSinceSent <= THREE_DAYS;

      const WEEK = 7 * DAY;
      if (sentAt.query === "last_week") return timeSinceSent <= WEEK;

      const THIRTY_DAYS = 30 * DAY;
      if (sentAt.query === "last_30_days") return timeSinceSent <= THIRTY_DAYS;

      return false;
    },
  });

  return sentAt;
}
