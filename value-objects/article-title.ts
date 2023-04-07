import { z } from "zod";
import { ARTICLE_TITLE_MAX_CHARS } from "./article-title-max-chars";

export const ArticleTitle = z
  .string()
  .trim()
  .max(ARTICLE_TITLE_MAX_CHARS)
  .nullish()
  .default("-")
  .brand<"article-title">();

export type ArticleTitleType = z.infer<typeof ArticleTitle>;
