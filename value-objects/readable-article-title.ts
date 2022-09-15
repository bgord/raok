import { z } from "zod";
import { Brand, toBrand } from "@bgord/node";

export type ReadableArticleTitleType = Brand<
  "readable-article-title",
  z.infer<typeof ReadableArticleTitleSchema>
>;

const ReadableArticleTitleSchema = z.string().trim().max(256);

export const ReadableArticleTitle = toBrand<ReadableArticleTitleType>(
  ReadableArticleTitleSchema
);
