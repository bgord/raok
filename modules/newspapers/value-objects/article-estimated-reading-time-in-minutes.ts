import { z } from "zod";

export const ArticleEstimatedReadingTimeInMinutes = z
  .number()
  .int()
  .positive()
  .nullable();

export type ArticleEstimatedReadingTimeInMinutesType = z.infer<
  typeof ArticleEstimatedReadingTimeInMinutes
>;
