import { z } from "zod";
import { ARTICLE_CONTENT_MAX_CHARS } from "./article-content-max-chars";

export const ReadableArticleContent = z
  .string()
  .trim()
  .min(1)
  .max(ARTICLE_CONTENT_MAX_CHARS)
  .brand<"readable-article-content">();

export type ReadableArticleContentType = z.infer<typeof ReadableArticleContent>;
