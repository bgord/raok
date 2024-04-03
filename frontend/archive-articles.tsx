/* eslint-disable jsx-a11y/label-has-associated-control */
import { RoutableProps } from "preact-router";
import { h } from "preact";
import { useInfiniteQuery } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as hooks from "./hooks";
import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";
import { TimestampFiltersEnum } from "./filters";
import { ArchiveArticle } from "./archive-article";

export type InitialArchiveArticlesDataType = {
  archiveArticles: bg.Paged<types.ArchiveArticleType>;
};

export function ArchiveArticles(_props: RoutableProps) {
  hooks.useLeavingPrompt();
  const t = bg.useTranslations();

  const search = bg.useField("article-search", "");
  const debouncedSearch = bg.useDebounce<string>({
    value: search.value,
    delayMs: 250,
  });

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

  const _archiveArticles = useInfiniteQuery(
    api.keys.archiveArticles(
      filters,
      debouncedSearch === "" ? undefined : debouncedSearch,
    ),
    ({ pageParam = 1 }) =>
      api.Archive.getArticles(pageParam, filters, debouncedSearch),
    { getNextPageParam: (page) => page.meta.nextPage, refetchOnMount: true },
  );

  const archiveArticles = bg.Pagination.infinite(_archiveArticles) ?? [];

  const numberOfArchiveArticles = archiveArticles.length;

  return (
    <main
      data-display="flex"
      data-direction="column"
      data-gap="24"
      data-md-gap="6"
      data-my="24"
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

        <UI.Badge>{numberOfArchiveArticles}</UI.Badge>
      </div>

      <div data-display="flex" data-cross="end" data-gap="12" data-md-gap="3">
        <div data-display="flex" data-direction="column">
          <label class="c-label" {...createdAtFilter.label.props}>
            {t("created_at")}
          </label>
          <UI.Select
            key={createdAtFilter.query}
            value={createdAtFilter.query}
            onInput={createdAtFilter.onChange}
            {...createdAtFilter.input.props}
          >
            {createdAtFilter.options.map((option) => (
              <option key={option} value={option}>
                {t(String(option))}
              </option>
            ))}
          </UI.Select>
        </div>

        <div data-display="flex" data-direction="column">
          <label class="c-label" {...statusFilter.label.props}>
            {t("app.status")}
          </label>
          <UI.Select
            key={statusFilter.query}
            value={statusFilter.query}
            onInput={statusFilter.onChange}
            {...statusFilter.input.props}
          >
            <option selected>{t("all")}</option>
            <hr />
            {statusFilter.options.map((status) => (
              <option key={status} value={status}>
                {t(String(status))}
              </option>
            ))}
          </UI.Select>
        </div>

        <div data-display="flex" data-direction="column">
          <label class="c-label" {...sourceFilter.label.props}>
            {t("article.source")}
          </label>
          <UI.Select
            class="c-select"
            key={sourceFilter.query}
            value={sourceFilter.query}
            onInput={sourceFilter.onChange}
            {...sourceFilter.input.props}
          >
            <option selected>{t("all")}</option>
            <hr />
            {sourceFilter.options.map((source) => (
              <option key={source} value={source}>
                {t(String(source))}
              </option>
            ))}
          </UI.Select>
        </div>

        <button
          type="button"
          class="c-button"
          data-variant="bare"
          disabled={
            createdAtFilter.unchanged &&
            statusFilter.unchanged &&
            sourceFilter.unchanged
          }
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
        data-md-mb="12"
      >
        <div data-position="relative" data-width="100%">
          <input
            list="articles"
            onInput={search.handleChange}
            required
            value={search.value}
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

        <UI.ClearButton disabled={search.unchanged} onClick={search.clear} />
      </div>

      {_archiveArticles.isSuccess && archiveArticles.length === 0 && (
        <UI.Info data-transform="upper-first">
          {t("articles.archive.empty")}
        </UI.Info>
      )}

      <datalist id="articles">
        {archiveArticles.map((article) => (
          <option key={article.id} value={String(article.title)} />
        ))}
      </datalist>

      <ul
        data-display="flex"
        data-direction="column"
        data-max-width="100%"
        data-gap="6"
      >
        {archiveArticles.map((article) => (
          <ArchiveArticle key={article.id} {...article} />
        ))}
      </ul>

      {_archiveArticles.hasNextPage && (
        <div data-display="flex">
          <button
            type="button"
            class="c-button"
            data-variant="bare"
            data-mx="auto"
            onClick={() => _archiveArticles.fetchNextPage()}
          >
            {t("app.load_more")}
          </button>
        </div>
      )}
    </main>
  );
}
