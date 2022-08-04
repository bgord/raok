import { z } from "zod";
import { Brand, toBrand } from "@bgord/node";

export type ArticleContentType = Brand<
  "article-content",
  z.infer<typeof ArticleContentSchema>
>;

const ArticleContentSchema = z.string().min(1);

export const ArticleContent = toBrand<ArticleContentType>(ArticleContentSchema);
