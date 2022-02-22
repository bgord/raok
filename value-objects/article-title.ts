import { z } from "zod";
import { Brand, toBrand } from "@bgord/node";

export type ArticleTitleType = Brand<
  "article-title",
  z.infer<typeof ArticleTitleSchema>
>;

const ArticleTitleSchema = z.string().nullish().default("-");

export const ArticleTitle = toBrand<ArticleTitleType>(ArticleTitleSchema);
