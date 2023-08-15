import { z } from "zod";

export const FeedlyArticleId = z
  .string()
  .trim()
  .min(1)
  .max(1024)
  .brand<"feedly-article-id">();
