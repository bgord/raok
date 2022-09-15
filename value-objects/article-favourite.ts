import * as bg from "@bgord/node";
import { z } from "zod";

export type ArticleFavouriteType = bg.Brand<
  "article-favourite",
  z.infer<typeof ArticleFavouriteSchema>
>;

const ArticleFavouriteSchema = z.boolean().default(false);

export const ArticleFavourite = bg.toBrand<ArticleFavouriteType>(
  ArticleFavouriteSchema
);
