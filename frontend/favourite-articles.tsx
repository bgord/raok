import { h } from "preact";
import { useQuery } from "react-query";

import * as UI from "./ui";
import { api } from "./api";
import { ArticleType } from "./types";

export function FavouriteArticles(props: { initialData: ArticleType[] }) {
  const articles = useQuery(
    ["favourite-articles"],
    api.getFavouriteArticles,
    props
  );

  return (
    <div
      data-bg="gray-100"
      data-p="12"
      data-bw="4"
      data-bct="gray-200"
      data-mt="48"
    >
      <UI.Header
        data-display="flex"
        data-cross="center"
        data-mb="24"
        data-color="gray-700"
      >
        <img height="20" width="20" src="/icon-star.svg" alt="" data-mr="12" />
        Favourite articles
      </UI.Header>

      {articles.data?.length === 0 && (
        <small data-color="gray-700">
          Your favourite sent articles will appear here
        </small>
      )}

      <ul style={{ listStyle: "none" }}>
        {articles.data?.map((article) => (
          <li
            data-display="flex"
            data-cross="center"
            data-overflow="hidden"
            data-wrap="nowrap"
            data-mb="12"
          >
            <UI.Link href={article.url}>{article.title || article.url}</UI.Link>

            <button class="c-button" data-variant="bare" data-ml="auto">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
