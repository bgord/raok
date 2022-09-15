import * as bg from "@bgord/node";
import { z } from "zod";

export type ArticleIdType = bg.Brand<
  "article-id",
  z.infer<typeof ArticleIdSchema>
>;

const ArticleIdSchema = bg.Schema.UUID;

export const ArticleId = bg.toBrand<ArticleIdType>(ArticleIdSchema);
