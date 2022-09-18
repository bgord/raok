import { z } from "zod";

export const ReadableArticleTitle = z
  .string()
  .trim()
  .max(256)
  .brand<"readable-article-title">();

export type ReadableArticleTitleType = z.infer<typeof ReadableArticleTitle>;
