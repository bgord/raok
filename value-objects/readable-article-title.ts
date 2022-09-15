import * as bg from "@bgord/node";
import { z } from "zod";

export type ReadableArticleTitleType = bg.Brand<
  "readable-article-title",
  z.infer<typeof ReadableArticleTitleSchema>
>;

const ReadableArticleTitleSchema = z.string().trim().max(256);

export const ReadableArticleTitle = bg.toBrand<ReadableArticleTitleType>(
  ReadableArticleTitleSchema
);
