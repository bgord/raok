import { z } from "zod";
import { Schema } from "@bgord/node";

export const ArticleOldMarker = Schema.Timestamp;

export type ArticleOldMarkerType = z.infer<typeof ArticleOldMarker>;
