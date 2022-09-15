import * as bg from "@bgord/node";
import { z } from "zod";

export type FeedlyArticleIdType = bg.Brand<
  "feedly-article-id",
  z.infer<typeof FeedlyArticleIdSchema>
>;

const FeedlyArticleIdSchema = z.string().trim().min(1);

export const FeedlyArticleId = bg.toBrand<FeedlyArticleIdType>(
  FeedlyArticleIdSchema
);
