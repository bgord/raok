import { z } from "zod";

import { ArticleUrl } from "./article-url";

export const FeedlyArticle = z.object({
  alternate: z.object({
    href: ArticleUrl,
  }),
});

export type FeedlyArticleType = z.infer<typeof FeedlyArticle>;
