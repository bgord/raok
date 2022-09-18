import { z } from "zod";

export const ArticleTitle = z
  .string()
  .trim()
  .nullish()
  .default("-")
  .brand<"article-title">();

export type ArticleTitleType = z.infer<typeof ArticleTitle>;
