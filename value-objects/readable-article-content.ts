import { z } from "zod";

import { ArticleContent } from "./article-content";

export const ReadableArticleContent = ArticleContent;

export type ReadableArticleContentType = z.infer<typeof ReadableArticleContent>;
