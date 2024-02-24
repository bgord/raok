import { h } from "preact";
import { useQuery } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as api from "./api";
import * as UI from "./ui";

export function Stats() {
  const t = bg.useTranslations();
  const pluralize = bg.usePluralize();

  const stats = useQuery(api.keys.stats, api.getStats);

  const createdArticles = stats.data?.createdArticles ?? 0;
  const sentNewspapers = stats.data?.sentNewspapers ?? 0;
  const articlesPerDay = stats.data?.articlesPerDay ?? null;

  const openedArticles = stats.data?.openedArticles ?? 0;
  const readArticles = stats.data?.readArticles ?? 0;
  const sentArticles = stats.data?.sentArticles ?? 0;

  return (
    <div data-mt="48" data-bg="gray-100" data-p="12" data-shadow>
      <UI.Header data-display="flex" data-mb="24" data-transform="upper-first">
        <Icons.StatsUpSquare height="20" width="20" data-mr="6" />
        <h4 data-fw="500" data-transform="upper-first">
          {t("app.statistics")}
        </h4>
      </UI.Header>

      <div data-display="flex" data-gap="6" data-fs="14" data-color="gray-600">
        <strong>{createdArticles}</strong>
        {t("stats.articles_added", {
          noun: pluralize({ value: createdArticles, singular: "article" }),
        })}

        <div data-fs="24">{" ·"}</div>
        {articlesPerDay && <strong>{articlesPerDay}</strong>}
        {t("stats.articles_per_day")}
      </div>

      <div data-display="flex" data-gap="6" data-fs="14" data-color="gray-600">
        <strong>{openedArticles}</strong>
        {t("stats.opened_articles")}
        <div>{"/"}</div>
        <strong>{readArticles}</strong>
        {t("stats.read_articles")}
        <div>{"/"}</div>
        <strong>{sentArticles}</strong>
        {t("stats.sent_articles")}
      </div>

      <div
        data-display="flex"
        data-gap="6"
        data-fs="14"
        data-color="gray-600"
        data-mt="12"
      >
        <strong>{sentNewspapers}</strong>
        {t("stats.newspapers_sent", {
          noun: pluralize({ value: createdArticles, singular: "newspaper" }),
        })}
      </div>
    </div>
  );
}
