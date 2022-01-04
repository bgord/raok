import { z } from "zod";
import { Brand, toBrand } from "@bgord/node";

export type FeedlyArticleIdType = Brand<
  "feedly-article-id",
  z.infer<typeof FeedlyArticleIdSchema>
>;

const FeedlyArticleIdSchema = z.string().nonempty();

export const FeedlyArticleId = toBrand<FeedlyArticleIdType>(
  FeedlyArticleIdSchema
);
