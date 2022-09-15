import * as bg from "@bgord/node";
import { z } from "zod";

export type ReadableArticleContentType = bg.Brand<
  "readable-article-content",
  z.infer<typeof ReadableArticleContentSchema>
>;

const ReadableArticleContentSchema = z.string().trim().min(1);

export const ReadableArticleContent = bg.toBrand<ReadableArticleContentType>(
  ReadableArticleContentSchema
);
