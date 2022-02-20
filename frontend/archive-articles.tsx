import { RoutableProps } from "preact-router";
import { h } from "preact";
import { useQuery } from "react-query";

import * as UI from "./ui";
import * as Icons from "./icons";
import * as api from "./api";
import { useSearch, useFilter, useTimestampFilter } from "./hooks";
import { ArticleType, ArticleSourceEnum, ArticleStatusEnum } from "./types";
import { ArchiveArticle } from "./archive-article";

export type InitialArchiveArticlesDataType = {
  archiveArticles: ArticleType[];
};

export function ArchiveArticles(
  props: InitialArchiveArticlesDataType & RoutableProps
) {
  const archiveArticles = useQuery("archive-articles", api.getArchiveArticles, {
    initialData: props.archiveArticles,
  });

  const search = useSearch();
  const sourceFilter = useFilter({ enum: ArticleSourceEnum });
  const statusFilter = useFilter({ enum: ArticleStatusEnum });
  const createdAt = useTimestampFilter({ defaultValue: "last_week" });

  const articles = (archiveArticles.data ?? [])
    .filter((article) => search.filterFn(article.title))
    .filter((article) => sourceFilter.filterFn(article.source))
    .filter((article) => statusFilter.filterFn(article.status))
    .filter((article) => createdAt.filterFn(article.createdAt));

  const numberOfArticles = articles.length;

  return (
    <main
      data-display="flex"
      data-direction="column"
      data-mx="auto"
      data-mt="24"
      data-max-width="768"
      data-width="100%"
    >
      <div
        data-display="flex"
        data-cross="center"
        data-mt="24"
        data-mb="36"
        data-bwt="4"
        data-bct="gray-100"
        data-pt="12"
      >
        <h2 data-fs="20" data-color="gray-800" data-fw="500">
          Archive Articles
        </h2>

        <UI.Badge data-ml="12" data-p="3">
          {numberOfArticles}
        </UI.Badge>
      </div>

      <div data-display="flex" data-cross="end" data-mb="24">
        <div data-display="flex" data-direction="column" data-mr="24">
          <label class="c-label" for="created-at">
            Created at
          </label>
          <div class="c-select-wrapper">
            <select
              id="created-at"
              name="created-at"
              class="c-select"
              value={createdAt.query}
              onInput={createdAt.onChange}
            >
              <option selected value="all">
                All
              </option>

              {createdAt.options.map((option) => (
                <option value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div data-display="flex" data-direction="column" data-mr="24">
          <label class="c-label" for="status">
            Status
          </label>
          <div class="c-select-wrapper">
            <select
              id="status"
              name="status"
              class="c-select"
              value={statusFilter.query}
              onInput={statusFilter.onChange}
            >
              <option selected value="all">
                All
              </option>

              {statusFilter.options.map((status) => (
                <option value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div data-display="flex" data-direction="column" data-mr="24">
          <label class="c-label" for="source">
            Source
          </label>
          <div class="c-select-wrapper">
            <select
              id="source"
              name="source"
              class="c-select"
              value={sourceFilter.query}
              onInput={sourceFilter.onChange}
            >
              <option selected value="all">
                All
              </option>

              {sourceFilter.options.map((source) => (
                <option value={source}>{source}</option>
              ))}
            </select>
          </div>
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
          Reset
        </button>
      </div>

      <div data-display="flex" data-mb="24" data-mt="12">
        <div data-position="relative">
          <input
            list="articles"
            onInput={search.onChange}
            value={search.query}
            class="c-input"
            placeholder="Search for an article..."
            style="min-width: 280px; padding-right: 36px"
          />
          <img
            loading="eager"
            height="34"
            width="34"
            src="/icon-search.svg"
            alt=""
            data-position="absolute"
            data-top="0"
            data-right="0"
            data-p="6"
            data-bg="white"
          />
        </div>

        <button
          type="button"
          onClick={search.clear}
          class="c-button"
          data-variant="bare"
          data-px="3"
          data-ml="6"
          data-mr="auto"
        >
          <Icons.Close />
        </button>
      </div>

      {archiveArticles.isSuccess && archiveArticles.data.length === 0 && (
        <div data-fs="14" data-color="gray-700">
          No archive articles.
        </div>
      )}

      <datalist id="articles">
        {archiveArticles.data?.map((article) => (
          <option value={article.title} />
        ))}
      </datalist>

      <ul data-display="flex" data-direction="column" data-mt="24" data-pb="24">
        {articles.map((article) => (
          <ArchiveArticle key={article.id} {...article} />
        ))}
      </ul>
    </main>
  );
}
