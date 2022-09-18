import { z } from "zod";

export const ArticleFavourite = z
  .boolean()
  .default(false)
  .brand<"article-favourite">();

export type ArticleFavouriteType = z.infer<typeof ArticleFavourite>;
