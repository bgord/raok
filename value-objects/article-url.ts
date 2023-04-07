import { z } from "zod";
import { ARTICLE_URL_MAX_CHARS } from "./article-url-max-chars";

export const ArticleUrl = z
  .string()
  .trim()
  .url()
  .min(1)
  .max(ARTICLE_URL_MAX_CHARS)
  .brand<"article-url">();

export type ArticleUrlType = z.infer<typeof ArticleUrl>;
