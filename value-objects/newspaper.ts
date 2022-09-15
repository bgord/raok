import * as bg from "@bgord/node";
import { z } from "zod";

import { NewspaperId } from "./newspaper-id";
import { NewspaperStatus } from "./newspaper-status";
import { Article } from "./article";

export const Newspaper = z.object({
  id: NewspaperId,
  articles: z.array(Article.pick({ id: true, url: true })),
  status: NewspaperStatus,
  scheduledAt: bg.Schema.Timestamp,
  sentAt: bg.Schema.Timestamp.nullable(),
});

export type NewspaperType = z.infer<typeof Newspaper>;
