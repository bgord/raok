import * as bg from "@bgord/node";
import { z } from "zod";

export type ArticleUrlType = bg.Brand<
  "article-url",
  z.infer<typeof ArticleUrlSchema>
>;

const ArticleUrlSchema = z.string().trim().url();

export const ArticleUrl = bg.toBrand<ArticleUrlType>(ArticleUrlSchema);
