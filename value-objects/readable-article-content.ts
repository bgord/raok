import { z } from "zod";
import { Brand, toBrand } from "@bgord/node";

export type ReadableArticleContentType = Brand<
  "readable-article-content",
  z.infer<typeof ReadableArticleContentSchema>
>;

const ReadableArticleContentSchema = z.string().trim().min(1);

export const ReadableArticleContent = toBrand<ReadableArticleContentType>(
  ReadableArticleContentSchema
);
