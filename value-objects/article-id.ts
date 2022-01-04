import { z } from "zod";
import { Schema, Brand, toBrand } from "@bgord/node";

export type ArticleIdType = Brand<
  "article-id",
  z.infer<typeof ArticleIdSchema>
>;

const ArticleIdSchema = Schema.UUID;

export const ArticleId = toBrand<ArticleIdType>(ArticleIdSchema);
