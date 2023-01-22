import { h } from "preact";
import { useQuery } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as api from "./api";
import * as UI from "./ui";

export function Stats() {
  const t = bg.useTranslations();
  const pluralize = bg.usePluralize();

  const stats = useQuery("stats", api.getStats);

  const createdArticles = stats.data?.createdArticles ?? 0;
  const sentNewspapers = stats.data?.sentNewspapers ?? 0;

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
      <UI.Header data-display="flex" data-mb="24" data-transform="upper-first">
        <Icons.StatsSquareUp data-mr="12" />
        <span data-transform="upper-first">{t("app.statistics")}</span>
      </UI.Header>

      <div data-fs="14" data-color="gray-600">
        <strong>{createdArticles} </strong>
        {pluralize({ value: createdArticles, singular: "article" })} added
        overall
      </div>

      <div data-fs="14" data-color="gray-600" data-mt="6">
        <strong>{sentNewspapers} </strong>
        {pluralize({ value: createdArticles, singular: "newspaper" })} sent
        overall
      </div>

      <div
        data-fs="12"
        data-color="gray-400"
        data-mt="12"
        title={bg.DateFormatter.datetime(stats.data?.lastFeedlyImport?.raw)}
      >
        Last Feedly import performed {lastFeedlyImportFormatted}
      </div>

      {stats.data?.hasFeedlyTokenExpired && (
        <div
          data-display="flex"
          data-cross="center"
          data-fs="14"
          data-mt="12"
          data-color="red-400"
        >
          <Icons.WarningCircledOutline width="18" height="18" />
          <span data-ml="6">Feedly token is not working</span>
        </div>
      )}
    </div>
  );
}
