import { z } from "zod";
import * as bg from "@bgord/node";

import { ArticleId } from "./article-id";
import { ArticleUrl } from "./article-url";
import { ArticleSource } from "./article-source";
import { ArticleStatus } from "./article-status";

export const Article = z.object({
  id: ArticleId,
  createdAt: bg.Schema.Timestamp,
  url: ArticleUrl,
  source: ArticleSource,
  status: ArticleStatus,
});

export type ArticleType = z.infer<typeof Article>;
