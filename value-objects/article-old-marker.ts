import * as bg from "@bgord/node";
import { z } from "zod";

export type ArticleOldMarkerType = bg.Brand<
  "article-old-marker",
  z.infer<typeof ArticleOldMarkerSchema>
>;

export const ArticleOldMarkerSchema = bg.Schema.Timestamp;

export const ArticleOldMarker = bg.toBrand<ArticleOldMarkerType>(
  ArticleOldMarkerSchema
);
