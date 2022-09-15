import * as bg from "@bgord/node";
import { z } from "zod";

export type ArticleContentType = bg.Brand<
  "article-content",
  z.infer<typeof ArticleContentSchema>
>;

const ArticleContentSchema = z.string().trim().min(1);

export const ArticleContent =
  bg.toBrand<ArticleContentType>(ArticleContentSchema);
