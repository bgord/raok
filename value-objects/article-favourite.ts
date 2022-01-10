import { z } from "zod";
import { Brand, toBrand } from "@bgord/node";

export type ArticleFavouriteType = Brand<
  "article-favourite",
  z.infer<typeof ArticleFavouriteSchema>
>;

const ArticleFavouriteSchema = z.boolean().default(false);

export const ArticleFavourite = toBrand<ArticleFavouriteType>(
  ArticleFavouriteSchema
);
