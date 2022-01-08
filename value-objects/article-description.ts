import { z } from "zod";
import { Brand, toBrand } from "@bgord/node";

export type ArticleDescriptionType = Brand<
  "article-description",
  z.infer<typeof ArticleDescriptionSchema>
>;

const ArticleDescriptionSchema = z.string().nullish();

export const ArticleDescription = toBrand<ArticleDescriptionType>(
  ArticleDescriptionSchema
);
