import { z } from "zod";

import {
  ARTICLE_SEARCH_QUERY_MIN_LENGTH,
  ARTICLE_SEARCH_QUERY_MIN_LENGTH_ERROR_MESSAGE,
} from "./article-search-query-min-length";
import {
  ARTICLE_SEARCH_QUERY_MAX_LENGTH,
  ARTICLE_SEARCH_QUERY_MAX_LENGTH_ERROR_MESSAGE,
} from "./article-search-query-max-length";

export const ArticleSearchQuery = z
  .string()
  .trim()
  .min(
    ARTICLE_SEARCH_QUERY_MIN_LENGTH,
    ARTICLE_SEARCH_QUERY_MIN_LENGTH_ERROR_MESSAGE
  )
  .max(
    ARTICLE_SEARCH_QUERY_MAX_LENGTH,
    ARTICLE_SEARCH_QUERY_MAX_LENGTH_ERROR_MESSAGE
  )
  .refine((value) => decodeURIComponent(value))
  .brand<"article-search-query">();

export type ArticleSearchQueryType = z.infer<typeof ArticleSearchQuery>;
