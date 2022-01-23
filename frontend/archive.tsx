import { RoutableProps } from "preact-router";
import { h } from "preact";
import { useQuery } from "react-query";

import { api } from "./api";
import { useSearch } from "./hooks";
import { ArticleType } from "./types";
import { ArchiveArticle } from "./archive-article";

export type InitialArchiveDataType = {
  archiveArticles: ArticleType[];
};

export function Archive(props: InitialArchiveDataType & RoutableProps) {
  const archiveArticles = useQuery("archive-articles", api.getArchiveArticles, {
    initialData: props.archiveArticles,
  });
  const search = useSearch();

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
        data-bwt="4"
        data-bct="gray-100"
        data-my="24"
        data-pt="12"
      >
        <h2 data-mr="auto" data-fs="20" data-color="gray-800" data-fw="500">
          Archived articles
        </h2>

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
        >
          <img
            loading="eager"
            height="24"
            width="24"
            src="/icon-close.svg"
            alt=""
          />
        </button>
      </div>

      <ul data-display="flex" data-direction="column" data-mt="24" data-pb="24">
        {archiveArticles.data
          ?.filter((article) => search.filterFn(article.title))
          .map((article) => (
            <ArchiveArticle key={article.id} {...article} />
          ))}
      </ul>
    </main>
  );
}
