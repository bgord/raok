import { z } from "zod";
import { ARTICLE_TITLE_MAX_CHARS } from "./article-title-max-chars";

export const ArticleTitle = z
  .string()
  .trim()
  .transform((value) => value.substring(0, ARTICLE_TITLE_MAX_CHARS))
  .nullish()
  .default("-")
  .brand<"article-title">();
