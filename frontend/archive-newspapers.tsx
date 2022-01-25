import { RoutableProps } from "preact-router";
import { h } from "preact";
import { useQuery } from "react-query";

import { api } from "./api";

import { Newspaper } from "./newspaper";

export function ArchiveNewspapers(_props: RoutableProps) {
  const archiveNewspapers = useQuery(
    "archive-newspapers",
    api.getArchiveNewspapers
  );

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

      {archiveNewspapers.isSuccess && archiveNewspapers.data.length === 0 && (
        <div data-fs="14" data-color="gray-700">
          No archive newspapers.
        </div>
      )}

      <ul data-display="flex" data-direction="column" data-mt="24" data-pb="24">
        {archiveNewspapers.data?.map((article) => (
          <Newspaper key={article.id} {...article} />
        ))}
      </ul>
    </main>
  );
}
