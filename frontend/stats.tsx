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
    <div data-mt="48" data-bg="gray-100" data-p="12">
      <UI.Header data-display="flex" data-mb="24" data-transform="upper-first">
        <Icons.StatsSquareUp height="20" width="20" data-mr="6" />
        <span data-transform="upper-first">{t("app.statistics")}</span>
      </UI.Header>

      <div data-fs="14" data-color="gray-600">
        {t("stats.articles_added", {
          value: createdArticles,
          noun: pluralize({ value: createdArticles, singular: "article" }),
        })}
      </div>

      <div data-fs="14" data-color="gray-600" data-mt="6">
        {t("stats.newspapers_sent", {
          value: sentNewspapers,
          noun: pluralize({ value: createdArticles, singular: "newspaper" }),
        })}
      </div>

      <UI.Info
        data-mt="12"
        title={bg.DateFormatter.datetime(stats.data?.lastFeedlyImport?.raw)}
      >
        {t("dashboard.crawling.last", { when: lastFeedlyImportFormatted })}
      </UI.Info>

      {stats.data?.hasFeedlyTokenExpired && (
        <div
          data-display="flex"
          data-cross="center"
          data-fs="14"
          data-mt="12"
          data-color="red-400"
        >
          <Icons.WarningCircledOutline width="18" height="18" />
          <span data-ml="6" data-transform="upper-first">
            {t("dashboard.crawling.broken_token")}
          </span>
        </div>
      )}
    </div>
  );
}
