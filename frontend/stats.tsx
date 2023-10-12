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

  return (
    <div data-mt="48" data-bg="gray-100" data-p="12" data-shadow>
      <UI.Header data-display="flex" data-mb="24" data-transform="upper-first">
        <Icons.StatsSquareUp height="20" width="20" data-mr="6" />
        <span data-transform="upper-first">{t("app.statistics")}</span>
      </UI.Header>

      <div data-display="flex" data-gap="6" data-fs="14" data-color="gray-600">
        <strong>{createdArticles}</strong>
        {t("stats.articles_added", {
          noun: pluralize({ value: createdArticles, singular: "article" }),
        })}
      </div>

      <div
        data-display="flex"
        data-gap="6"
        data-fs="14"
        data-color="gray-600"
        data-mt="6"
      >
        <strong>{sentNewspapers}</strong>
        {t("stats.newspapers_sent", {
          noun: pluralize({ value: createdArticles, singular: "newspaper" }),
        })}
      </div>
    </div>
  );
}
