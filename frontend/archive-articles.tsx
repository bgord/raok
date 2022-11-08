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

  const createdAt = bg.useUrlFilter({
    enum: TimestampFiltersEnum,
    defaultQuery: TimestampFiltersEnum.last_3_days,
    label: "createdAt",
  });

  const filters = {
    status: statusFilter.query,
    source: sourceFilter.query,
    createdAt: createdAt.query,
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
      data-gap="24"
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
          Archive Articles
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
            value={createdAt.query}
            onInput={createdAt.onChange}
          >
            {createdAt.options.map((option) => (
              <option value={option}>{t(option)}</option>
            ))}
          </UI.Select>
        </div>

        <div data-display="flex" data-direction="column">
          <label class="c-label" htmlFor="status">
            Status
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
            Source
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
            createdAt.clear();
            statusFilter.clear();
            sourceFilter.clear();
          }}
        >
          Reset filters
        </button>
      </div>

      <div data-display="flex" data-wrap="nowrap" data-max-width="100%">
        <div data-position="relative" data-width="100%">
          <input
            list="articles"
            onInput={search.onChange}
            value={search.query}
            class="c-input"
            placeholder="Search for an article..."
            style="padding-right: 36px"
            data-width="100%"
          />
          <Icons.Search
            height="34"
            width="34"
            data-position="absolute"
            data-p="6"
            style="top: 1px; right: 1px; background: white;"
          />
        </div>

        <button
          type="button"
          onClick={search.clear}
          class="c-button"
          data-variant="bare"
          data-px="3"
        >
          <Icons.Cancel width="24" height="24" />
        </button>
      </div>

      {archiveArticles.isSuccess && archiveArticles.data.length === 0 && (
        <div data-fs="14" data-color="gray-700">
          No archive articles.
        </div>
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
