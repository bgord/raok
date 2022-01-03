import { z } from "zod";
type Brand<B extends string, T> = { _brand: B } & T;

export type ArticleContentType = Brand<
  "article-content",
  z.infer<typeof ArticleContentSchema>
>;

const ArticleContentSchema = z.string().max(100000);

export const ArticleContent = ArticleContentSchema.transform(
  (x) => x as ArticleContentType
);
