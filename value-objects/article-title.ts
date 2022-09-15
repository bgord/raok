import { z } from "zod";
import * as bg from "@bgord/node";

export type ArticleTitleType = bg.Brand<
  "article-title",
  z.infer<typeof ArticleTitleSchema>
>;

const ArticleTitleSchema = z.string().trim().nullish().default("-");

export const ArticleTitle = bg.toBrand<ArticleTitleType>(ArticleTitleSchema);
