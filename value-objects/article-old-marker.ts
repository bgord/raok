import { z } from "zod";
import { Schema } from "@bgord/node";
import { Brand, toBrand } from "../brand";

export type ArticleOldMarkerType = Brand<
  "article-old-marker",
  z.infer<typeof ArticleOldMarkerSchema>
>;

export const ArticleOldMarkerSchema = Schema.Timestamp;

export const ArticleOldMarker = toBrand<ArticleOldMarkerType>(
  ArticleOldMarkerSchema
);
