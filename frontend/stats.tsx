import { h } from "preact";
import { useQuery } from "react-query";

import { Header } from "./ui";
import { api } from "./api";
import { StatsType } from "./types";

export function Stats(props: { initialData: StatsType }) {
  const stats = useQuery(["stats"], api.getStats, props);

  const createdArticles = stats.isSuccess ? stats.data.createdArticles : "-";

  return (
    <div data-bg="gray-100" data-p="12">
      <Header data-mb="24">Statistics</Header>

      <div data-fs="14" data-color="gray-600">
        <strong>{createdArticles} </strong>
        created article(s) overall
      </div>
    </div>
  );
}
