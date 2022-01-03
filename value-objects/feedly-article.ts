import { z } from "zod";

import { FeedlyArticleId } from "./feedly-article-id";
import { ArticleUrl } from "./article-url";

export const FeedlyArticle = z.object({
  id: FeedlyArticleId,
  canonicalUrl: ArticleUrl.optional(),
});

export type FeedlyArticleType = z.infer<typeof FeedlyArticle>;
