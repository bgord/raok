import { h } from "preact";
import { RoutableProps } from "preact-router";
import { useQuery } from "react-query";

import * as api from "./api";

import { ArticleType } from "./types";

export type InitialReviewDataType = {
  articles: ArticleType[];
};

export function Review(props: RoutableProps & InitialReviewDataType) {
  const articles = useQuery("articles", api.getArticles, {
    initialData: props.articles,
  });

  return (
    <main
      data-display="flex"
      data-direction="column"
      data-mx="auto"
      data-mt="48"
      data-max-width="768"
    >
      review some shit
    </main>
  );
}
