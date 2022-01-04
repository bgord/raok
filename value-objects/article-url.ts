import { z } from "zod";
import { Brand, toBrand } from "@bgord/node";

export type ArticleUrlType = Brand<
  "article-url",
  z.infer<typeof ArticleUrlSchema>
>;

const ArticleUrlSchema = z.string().url();

export const ArticleUrl = toBrand<ArticleUrlType>(ArticleUrlSchema);
