import { ARTICLE_TITLE_MAX_CHARS } from "./article-title-max-chars";
import { ARTICLE_URL_MAX_CHARS } from "./article-url-max-chars";

export const ARTICLE_SEARCH_QUERY_MAX_LENGTH = Math.max(
  ARTICLE_TITLE_MAX_CHARS,
  ARTICLE_URL_MAX_CHARS
);

export const ARTICLE_SEARCH_QUERY_MAX_LENGTH_ERROR_MESSAGE =
  "article.search.max_length.error";
