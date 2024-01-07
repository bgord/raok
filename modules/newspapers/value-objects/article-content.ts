import { z } from "zod";
import { ARTICLE_CONTENT_MAX_CHARS } from "./article-content-max-chars";

export const ArticleContent = z
  .string()
  .trim()
  .min(1)
  .max(ARTICLE_CONTENT_MAX_CHARS);

export type ArticleContentType = z.infer<typeof ArticleContent>;
