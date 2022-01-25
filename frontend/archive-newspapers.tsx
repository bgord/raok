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
        data-my="24"
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
        <div data-display="flex" data-direction="column" data-ml="auto">
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
          .map((newspaper) => (
            <Newspaper key={newspaper.id} {...newspaper} />
          ))}
      </ul>
    </main>
  );
}
