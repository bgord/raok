import { z } from "zod";
import * as bg from "@bgord/node";

import { ArticleId } from "./article-id";
import { ArticleUrl } from "./article-url";
import { ArticleSource } from "./article-source";
import { ArticleStatus } from "./article-status";
import { ArticleContent } from "./article-content";
import { ArticleTitle } from "./article-title";
import { ArticleEstimatedReadingTimeInMinutes } from "./article-estimated-reading-time-in-minutes";

export const Article = z.object({
  id: ArticleId,
  createdAt: bg.Schema.Timestamp,
  url: ArticleUrl,
  source: ArticleSource,
  status: ArticleStatus,
  estimatedReadingTimeInMinutes: ArticleEstimatedReadingTimeInMinutes,
});

export const ReadableArticle = z.object({
  content: ArticleContent,
  title: ArticleTitle,
  readingTime: ArticleEstimatedReadingTimeInMinutes,
});

export type ArticleType = z.infer<typeof Article>;
export type ReadableArticleType = z.infer<typeof ReadableArticle>;
