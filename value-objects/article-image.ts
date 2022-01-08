import { z } from "zod";
import { Brand, toBrand } from "@bgord/node";

export type ArticleImageType = Brand<
  "article-image",
  z.infer<typeof ArticleImageSchema>
>;

const ArticleImageSchema = z.string().url().nullish();

export const ArticleImage = toBrand<ArticleImageType>(ArticleImageSchema);
