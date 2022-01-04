import { z } from "zod";
import { Brand, toBrand } from "@bgord/node";

export type ReadableArticleContentType = Brand<
  "readable-article-content",
  z.infer<typeof ReadableArticleContentSchema>
>;

const ReadableArticleContentSchema = z.string().max(100000);

export const ReadableArticleContent = toBrand<ReadableArticleContentType>(
  ReadableArticleContentSchema
);
