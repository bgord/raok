import { z } from "zod";

import { ReadableArticleContent } from "./readable-article-content";
import { ReadableArticleTitle } from "./readable-article-title";
import { ReadableArticleReadingTime } from "./readable-article-reading-time";

const ReadbleArticle = z.object({
  title: ReadableArticleTitle,
  content: ReadableArticleContent,
  readingTime: ReadableArticleReadingTime,
});

export type ReadableArticleType = z.infer<typeof ReadbleArticle>;
