import { h } from "preact";
import { useQuery } from "react-query";

import { StatsType } from "./types";

const defaultStats: StatsType = {
  createdArticles: 0,
};

export function Stats() {
  const stats = useQuery(
    ["stats"],
    async (): Promise<StatsType> =>
      fetch("/stats", {
        method: "GET",
        mode: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      }).then((response) => (response.ok ? response.json() : defaultStats)),
    { initialData: defaultStats }
  );

  const createdArticles = stats.isSuccess
    ? stats.data.createdArticles
    : defaultStats.createdArticles;

  return (
    <div data-bg="gray-100" data-p="12">
      <h2 data-fs="16" data-color="gray-800" data-fw="500" data-mb="24">
        Statistics
      </h2>

      <div data-fs="14" data-color="gray-600">
        <strong>{createdArticles} </strong>
        created article(s) overall
      </div>
    </div>
  );
}
