import * as bg from "@bgord/node";
import { z } from "zod";

export const ArticleId = bg.Schema.UUID.brand<"article-id">();

export type ArticleIdType = z.infer<typeof ArticleId>;
