import { RoutableProps } from "preact-router";
import { h } from "preact";
import { useQuery } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as hooks from "./hooks";
import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";
import { TimestampFiltersEnum } from "./filters";
import { ArchiveArticle } from "./archive-article";

export type InitialArchiveArticlesDataType = {
  archiveArticles: types.ArchiveArticleType[];
};

export function ArchiveArticles(_props: RoutableProps) {
  hooks.useLeavingPrompt();
  const t = bg.useTranslations();
  const search = bg.useClientSearch();

  const sourceFilter = bg.useUrlFilter({
    enum: types.ArticleSourceEnum,
    label: "source",
  });

  const statusFilter = bg.useUrlFilter({
    enum: types.ArticleStatusEnum,
    label: "status",
  });

  const createdAtFilter = bg.useUrlFilter({
    enum: TimestampFiltersEnum,
    defaultQuery: TimestampFiltersEnum.last_3_days,
    label: "createdAt",
  });

  const filters = {
    status: statusFilter.query,
    source: sourceFilter.query,
    createdAt: createdAtFilter.query,
  };

  const archiveArticles = useQuery(["archive-articles", filters], () =>
    api.getArchiveArticles(filters)
  );

  const articles = (archiveArticles.data ?? []).filter((article) =>
    search.filterFn(String(article.title))
  );

  const numberOfArticles = articles.length;

  return (
    <main
      data-display="flex"
      data-direction="column"
      data-gap="36"
      data-mt="24"
      data-mx="auto"
      data-md-pl="6"
      data-md-pr="3"
      data-max-width="768"
      data-md-max-width="100%"
      data-width="100%"
    >
      <div data-display="flex" data-gap="12" data-cross="center">
        <h2 data-fs="20" data-color="gray-800" data-fw="500">
          {t("articles.archive")}
        </h2>

        <UI.Badge>{numberOfArticles}</UI.Badge>
      </div>

      <div data-display="flex" data-cross="end" data-gap="24" data-md-gap="12">
        <div data-display="flex" data-direction="column">
          <label class="c-label" htmlFor="created-at">
            Created at
          </label>
          <UI.Select
            id="created-at"
            name="created-at"
            value={createdAtFilter.query}
            onInput={createdAtFilter.onChange}
          >
            {createdAtFilter.options.map((option) => (
              <option value={option}>{t(option)}</option>
            ))}
          </UI.Select>
        </div>

        <div data-display="flex" data-direction="column">
          <label class="c-label" htmlFor="status">
            {t("app.status")}
          </label>
          <UI.Select
            id="status"
            name="status"
            value={statusFilter.query}
            onInput={statusFilter.onChange}
          >
            <option selected>{t("all")}</option>

            {statusFilter.options.map((status) => (
              <option value={status}>{t(status)}</option>
            ))}
          </UI.Select>
        </div>

        <div data-display="flex" data-direction="column">
          <label class="c-label" htmlFor="source">
            {t("article.source")}
          </label>
          <UI.Select
            id="source"
            name="source"
            class="c-select"
            value={sourceFilter.query}
            onInput={sourceFilter.onChange}
          >
            <option selected>{t("all")}</option>

            {sourceFilter.options.map((source) => (
              <option value={source}>{t(source)}</option>
            ))}
          </UI.Select>
        </div>

        <button
          type="button"
          class="c-button"
          data-variant="bare"
          onClick={() => {
            createdAtFilter.clear();
            statusFilter.clear();
            sourceFilter.clear();
          }}
        >
          {t("app.reset")}
        </button>
      </div>

      <div
        data-display="flex"
        data-wrap="nowrap"
        data-max-width="100%"
        data-gap="6"
      >
        <div data-position="relative" data-width="100%">
          <input
            list="articles"
            onInput={search.onChange}
            value={search.query}
            class="c-input"
            placeholder={t("article.search.placeholder")}
            data-width="100%"
          />
          <Icons.Search
            height="34"
            width="34"
            data-position="absolute"
            data-p="6"
            data-top="0"
            data-right="0"
          />
        </div>

        <UI.ClearButton onClick={search.clear} />
      </div>

      {archiveArticles.isSuccess && articles.length === 0 && (
        <UI.Info data-transform="upper-first">
          {t("articles.archive.empty")}
        </UI.Info>
      )}

      <datalist id="articles">
        {archiveArticles.data?.map((article) => (
          <option value={String(article.title)} />
        ))}
      </datalist>

      <ul data-display="flex" data-direction="column" data-max-width="100%">
        {articles.map((article) => (
          <ArchiveArticle key={article.id} {...article} />
        ))}
      </ul>
    </main>
  );
}
