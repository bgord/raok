import { z } from "zod";
import { ARTICLE_TITLE_MAX_CHARS } from "./article-title-max-chars";

export const ReadableArticleTitle = z
  .string()
  .trim()
  .min(1)
  .max(ARTICLE_TITLE_MAX_CHARS)
  .brand<"readable-article-title">();

export type ReadableArticleTitleType = z.infer<typeof ReadableArticleTitle>;
