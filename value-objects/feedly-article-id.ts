import { z } from "zod";

export const FeedlyArticleId = z
  .string()
  .trim()
  .min(1)
  .max(1024) // TODO: what's the usual id length?
  .brand<"feedly-article-id">();

export type FeedlyArticleIdType = z.infer<typeof FeedlyArticleId>;
