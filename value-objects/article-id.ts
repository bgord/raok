import { z } from "zod";
import { Schema } from "@bgord/node";

import { Brand, toBrand } from "./_brand";

export type ArticleIdType = Brand<
  "article-id",
  z.infer<typeof ArticleIdSchema>
>;

const ArticleIdSchema = Schema.UUID;

export const ArticleId = toBrand<ArticleIdType>(ArticleIdSchema);
