import { z } from "zod";
import { Schema } from "@bgord/node";

import { NewspaperId } from "./newspaper-id";
import { NewspaperStatus } from "./newspaper-status";
import { Article } from "./article";

export const Newspaper = z.object({
  id: NewspaperId,
  articles: z.array(Article.pick({ id: true, url: true })),
  status: NewspaperStatus,
  scheduledAt: Schema.Timestamp,
  sentAt: Schema.Timestamp.nullable(),
});

export type NewspaperType = z.infer<typeof Newspaper>;
