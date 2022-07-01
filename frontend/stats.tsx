import { h } from "preact";
import { useQuery } from "react-query";
import { StatsSquareUp } from "iconoir-react";

import * as api from "./api";
import { Header } from "./ui";
import { StatsType } from "./types";

export function Stats(props: { initialData: StatsType }) {
  const stats = useQuery(["stats"], api.getStats, {
    ...props,
    refetchOnMount: false,
  });

  const createdArticles = stats.data?.createdArticles ?? "-";
  const sentNewspapers = stats.data?.sentNewspapers ?? "-";
  const lastFeedlyImport = stats.data?.lastFeedlyImport ?? "N/A";

  return (
    <div
      data-mt="48"
      data-bg="gray-100"
      data-p="12"
      data-bw="4"
      data-bct="gray-200"
    >
      <Header data-display="flex" data-mb="24">
        <StatsSquareUp data-mr="12" />
        Statistics
      </Header>

      <div data-fs="14" data-color="gray-600">
        <strong>{createdArticles} </strong>
        articles added overall
      </div>

      <div data-fs="14" data-color="gray-600" data-mt="6">
        <strong>{sentNewspapers} </strong>
        newspapers sent overall
      </div>

      <div data-fs="12" data-color="gray-400" data-mt="12">
        Last Feedly import performed {lastFeedlyImport}
      </div>
    </div>
  );
}
