import { z } from "zod";

export const ReadableArticleReadingTime = z
  .number()
  .int()
  .positive()
  .brand<"readable-article-reading-time">();

export type ReadableArticleReadingTimeType = z.infer<
  typeof ReadableArticleReadingTime
>;
