import { h } from "preact";
import { useQuery } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as api from "./api";
import * as UI from "./ui";
import * as types from "./types";

export function Stats() {
  const stats = useQuery("stats", api.getStats);

  const createdArticles = stats.data?.createdArticles ?? "-";
  const sentNewspapers = stats.data?.sentNewspapers ?? "-";

  const lastFeedlyImportFormatted =
    stats.data?.lastFeedlyImport?.relative ?? "N/A";

  return (
    <div
      data-mt="48"
      data-bg="gray-100"
      data-p="12"
      data-bw="4"
      data-bct="gray-200"
    >
      <UI.Header data-display="flex" data-mb="24">
        <Icons.StatsSquareUp data-mr="12" />
        Statistics
      </UI.Header>

      <div data-fs="14" data-color="gray-600">
        <strong>{createdArticles} </strong>
        articles added overall
      </div>

      <div data-fs="14" data-color="gray-600" data-mt="6">
        <strong>{sentNewspapers} </strong>
        newspapers sent overall
      </div>

      <div
        data-fs="12"
        data-color="gray-400"
        data-mt="12"
        title={bg.DateFormatter.datetime(stats.data?.lastFeedlyImport?.raw)}
      >
        Last Feedly import performed {lastFeedlyImportFormatted}
      </div>
    </div>
  );
}
