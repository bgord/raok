/* eslint-disable jsx-a11y/label-has-associated-control */
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
    name: "source",
    enum: types.ArticleSourceEnum,
  });

  const statusFilter = bg.useUrlFilter({
    name: "status",
    enum: types.ArticleStatusEnum,
  });

  const createdAtFilter = bg.useUrlFilter({
    name: "created-at",
    enum: TimestampFiltersEnum,
    defaultQuery: TimestampFiltersEnum.last_3_days,
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
          <label class="c-label" {...createdAtFilter.label.props}>
            Created at
          </label>
          <UI.Select
            value={createdAtFilter.query}
            onInput={createdAtFilter.onChange}
            {...createdAtFilter.input.props}
          >
            {createdAtFilter.options.map((option) => (
              <option value={option}>{t(String(option))}</option>
            ))}
          </UI.Select>
        </div>

        <div data-display="flex" data-direction="column">
          <label class="c-label" {...statusFilter.label.props}>
            {t("app.status")}
          </label>
          <UI.Select
            value={statusFilter.query}
            onInput={statusFilter.onChange}
            {...statusFilter.input.props}
          >
            <option selected>{t("all")}</option>

            {statusFilter.options.map((status) => (
              <option value={status}>{t(String(status))}</option>
            ))}
          </UI.Select>
        </div>

        <div data-display="flex" data-direction="column">
          <label class="c-label" {...sourceFilter.label.props}>
            {t("article.source")}
          </label>
          <UI.Select
            class="c-select"
            value={sourceFilter.query}
            onInput={sourceFilter.onChange}
            {...sourceFilter.input.props}
          >
            <option selected>{t("all")}</option>

            {sourceFilter.options.map((source) => (
              <option value={source}>{t(String(source))}</option>
            ))}
          </UI.Select>
        </div>

        <button
          type="button"
          class="c-button"
          data-variant="bare"
          onClick={bg.exec([
            createdAtFilter.clear,
            statusFilter.clear,
            sourceFilter.clear,
          ])}
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
