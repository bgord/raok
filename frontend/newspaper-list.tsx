import { h } from "preact";
import { useQuery } from "react-query";

import { api } from "./api";
import { Newspaper } from "./newspaper";

export function NewspaperList() {
  const newspapers = useQuery(["newspapers"], api.getNewspapers, {
    initialData: [],
  });

  return (
    <section data-mt="48">
      <div
        data-display="flex"
        data-cross="center"
        data-bg="gray-100"
        data-bw="1"
        data-bc="gray-200"
        data-p="12"
      >
        <h2 data-fs="16" data-color="gray-800" data-fw="500">
          Newspapers
        </h2>
      </div>

      {newspapers.isSuccess && newspapers.data.length === 0 && (
        <small data-md-px="12" data-mt="12" data-ml="6">
          No newspapers added at the moment
        </small>
      )}

      <ul data-mt="24">
        {newspapers.isSuccess &&
          newspapers.data.map((newspaper) => <Newspaper {...newspaper} />)}
      </ul>
    </section>
  );
}
