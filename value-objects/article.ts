import { z } from "zod";
import { Schema } from "@bgord/node";

import { ArticleUrl } from "./article-url";
import { ArticleSource } from "./article-source";

export const Article = z.object({
  id: Schema.UUID,
  createdAt: z
    .number()
    .positive()
    .default(() => Date.now()),
  url: ArticleUrl,
  source: ArticleSource,
});

export type ArticleType = z.infer<typeof Article>;
