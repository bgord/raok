import { z } from "zod";

export const ReadableArticleReadingTime = z.number().positive();

export type ReadableArticleReadingTimeType = z.infer<
  typeof ReadableArticleReadingTime
>;
