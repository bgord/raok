import { z } from "zod";

import {
  ARTICLE_SEARCH_QUERY_MAX_LENGTH,
  ARTICLE_SEARCH_QUERY_MAX_LENGTH_ERROR_MESSAGE,
} from "./article-search-query-max-length";

export const ArticleArchiveSearchQuery = z
  .string()
  .max(
    ARTICLE_SEARCH_QUERY_MAX_LENGTH,
    ARTICLE_SEARCH_QUERY_MAX_LENGTH_ERROR_MESSAGE
  )
  .default("")
  .transform((value) => (value === "" ? undefined : decodeURIComponent(value)));

export type ArticleArchiveSearchQueryType = z.infer<
  typeof ArticleArchiveSearchQuery
>;
