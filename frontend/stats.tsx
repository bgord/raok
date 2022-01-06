import { h } from "preact";
import { useQuery } from "react-query";

import { api } from "./api";
import { StatsType } from "./types";

export function Stats(props: { initialData: StatsType }) {
  const stats = useQuery(["stats"], api.getStats, {
    initialData: props.initialData,
  });

  const createdArticles = stats.isSuccess ? stats.data.createdArticles : "-";

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
