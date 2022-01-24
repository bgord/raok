import { RoutableProps } from "preact-router";
import { h } from "preact";
import { useQuery } from "react-query";

import { api } from "./api";
import { useSearch, useFilter } from "./hooks";
import { ArticleType } from "./types";
import { ArchiveArticle } from "./archive-article";

import { ArticleSourceEnum, ArticleStatusEnum } from "../value-objects/types";

export type InitialArchiveDataType = {
  archiveArticles: ArticleType[];
};

export function Archive(props: InitialArchiveDataType & RoutableProps) {
  const archiveArticles = useQuery("archive-articles", api.getArchiveArticles, {
    initialData: props.archiveArticles,
  });

  const search = useSearch();
  const source = useFilter({ enum: ArticleSourceEnum });
  const status = useFilter({ enum: ArticleStatusEnum });

  return (
    <main
      data-display="flex"
      data-direction="column"
      data-mx="auto"
      data-mt="24"
      data-max-width="768"
      data-width="100%"
    >
      <h2
        data-my="24"
        data-pt="12"
        data-fs="20"
        data-color="gray-800"
        data-bwt="4"
        data-bct="gray-100"
        data-fw="500"
        data-width="100%"
      >
        Archived articles
      </h2>

      <div data-display="flex" data-cross="end" data-mb="24">
        <div data-position="relative">
          <input
            onInput={search.onChange}
            value={search.query}
            class="c-input"
            placeholder="Search for an article..."
            style="min-width: 280px; padding-right: 36px"
          />
          <img
            data-position="absolute"
            loading="eager"
            height="34"
            width="34"
            src="/icon-search.svg"
            alt=""
            data-p="6"
            style="top: 1px; right: 1px; background: white"
          />
        </div>

        <button
          onClick={search.clear}
          class="c-button"
          data-variant="bare"
          data-px="3"
          data-ml="6"
          data-mr="auto"
        >
          <img
            loading="eager"
            height="24"
            width="24"
            src="/icon-close.svg"
            alt=""
          />
        </button>

        <div data-display="flex" data-direction="column" data-mr="24">
          <label class="c-label" for="status">
            Status
          </label>
          <div class="c-select-wrapper">
            <select
              id="status"
              name="status"
              class="c-select"
              value={status.query}
              onInput={status.onChange}
            >
              <option selected value="all">
                All
              </option>

              {status.options.map((status) => (
                <option value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div data-display="flex" data-direction="column">
          <label class="c-label" for="source">
            Source
          </label>
          <div class="c-select-wrapper">
            <select
              id="source"
              name="source"
              class="c-select"
              value={source.query}
              onInput={source.onChange}
            >
              <option selected value="all">
                All
              </option>

              {source.options.map((source) => (
                <option value={source}>{source}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <ul data-display="flex" data-direction="column" data-mt="24" data-pb="24">
        {archiveArticles.data
          ?.filter((article) => search.filterFn(article.title))
          .filter((article) => source.filterFn(article.source))
          .filter((article) => status.filterFn(article.status))
          .map((article) => (
            <ArchiveArticle key={article.id} {...article} />
          ))}
      </ul>
    </main>
  );
}
