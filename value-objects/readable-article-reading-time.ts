import * as bg from "@bgord/node";
import { z } from "zod";

export type ReadableArticleReadingTimeType = bg.Brand<
  "readable-article-reading-time",
  z.infer<typeof ReadableArticleReadingTimeSchema>
>;

const ReadableArticleReadingTimeSchema = z.number().int().positive();

export const ReadableArticleReadingTime =
  bg.toBrand<ReadableArticleReadingTimeType>(ReadableArticleReadingTimeSchema);
