import { z } from "zod";

import { ARTICLE_SEARCH_QUERY_MIN_LENGTH } from "./article-search-query-min-length";
import { ARTICLE_SEARCH_QUERY_MAX_LENGTH } from "./article-search-query-max-length";

export const ArticleSearchQuery = z
  .string()
  .min(ARTICLE_SEARCH_QUERY_MAX_LENGTH)
  .max(ARTICLE_SEARCH_QUERY_MIN_LENGTH)
  .brand<"article-search-query">();

export type ArticleSearchQueryType = z.infer<typeof ArticleSearchQuery>;
