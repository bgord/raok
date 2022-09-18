import { z } from "zod";

export const ReadableArticleContent = z
  .string()
  .trim()
  .min(1)
  .brand<"readable-article-content">();

export type ReadableArticleContentType = z.infer<typeof ReadableArticleContent>;
