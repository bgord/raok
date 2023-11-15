import { z } from "zod";

export const ArticleEstimatedReadingTimeInMinutes = z
  .number()
  .int()
  .positive()
  .nullish();

export type ArticleEstimatedReadingTimeInMinutesType = z.infer<
  typeof ArticleEstimatedReadingTimeInMinutes
>;
