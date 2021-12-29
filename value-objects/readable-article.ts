import { z } from "zod";

import { ReadableArticleContent } from "./readable-article-content";
import { ReadableArticleTitle } from "./readable-article-title";

export const ReadbleArticle = z.object({
  title: ReadableArticleTitle,
  content: ReadableArticleContent,
});

export type ReadableArticleType = z.infer<typeof ReadbleArticle>;
