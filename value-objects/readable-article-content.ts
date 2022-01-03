import { z } from "zod";
type Brand<B extends string, T> = { _brand: B } & T;

const ReadableArticleContentSchema = z.string().max(100000);

export const ReadableArticleContent = ReadableArticleContentSchema.transform(
  (x) => x as ReadableArticleContentType
);

export type ReadableArticleContentType = Brand<
  "readable-article-content",
  z.infer<typeof ReadableArticleContentSchema>
>;
