import { z } from "zod";
import { Brand, toBrand } from "./_brand";

export type ReadableArticleTitleType = Brand<
  "readable-article-title",
  z.infer<typeof ReadableArticleTitleSchema>
>;

const ReadableArticleTitleSchema = z.string().max(256);

export const ReadableArticleTitle = toBrand<ReadableArticleTitleType>(
  ReadableArticleTitleSchema
);
