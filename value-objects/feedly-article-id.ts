import { z } from "zod";

export const FeedlyArticleId = z
  .string()
  .trim()
  .min(1)
  .brand<"feedly-article-id">();

export type FeedlyArticleIdType = z.infer<typeof FeedlyArticleId>;
