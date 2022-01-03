import { z } from "zod";
import { Brand, toBrand } from "./_brand";

export type ReadableArticleReadingTimeType = Brand<
  "readable-article-reading-time",
  z.infer<typeof ReadableArticleReadingTimeSchema>
>;

const ReadableArticleReadingTimeSchema = z.number().int().positive();

export const ReadableArticleReadingTime =
  toBrand<ReadableArticleReadingTimeType>(ReadableArticleReadingTimeSchema);
