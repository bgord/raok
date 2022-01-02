import { z } from "zod";

import { ArticleUrl } from "./article-url";

export const FeedlyArticle = z.object({
  canonicalUrl: ArticleUrl.optional(),
});

export type FeedlyArticleType = z.infer<typeof FeedlyArticle>;
