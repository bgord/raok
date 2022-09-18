import { z } from "zod";

export const ArticleContent = z
  .string()
  .trim()
  .min(1)
  .brand<"article-content">();

export type ArticleContentType = z.infer<typeof ArticleContent>;
