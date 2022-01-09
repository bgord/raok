import { h } from "preact";
import { useQuery } from "react-query";

import { Header } from "./ui";
import { api } from "./api";
import { StatsType } from "./types";

export function Stats(props: { initialData: StatsType }) {
  const stats = useQuery(["stats"], api.getStats, props);

  const createdArticles = stats.isSuccess ? stats.data.createdArticles : "-";
  const sentNewspapers = stats.isSuccess ? stats.data.sentNewspapers : "-";

  return (
    <div data-bg="gray-100" data-p="12" data-bw="4" data-bct="gray-200">
      <Header
        data-display="flex"
        data-cross="center"
        data-mb="24"
        data-color="gray-700"
      >
        <img height="20" width="20" src="/icon-stats.svg" alt="" data-mr="12" />
        Statistics
      </Header>

      <div data-fs="14" data-color="gray-600">
        <strong>{createdArticles} </strong>
        created article(s) overall
      </div>

      <div data-fs="14" data-color="gray-600" data-mt="6">
        <strong>{sentNewspapers} </strong>
        sent newspapers(s) overall
      </div>
    </div>
  );
}
