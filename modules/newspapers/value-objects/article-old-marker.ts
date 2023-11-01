import * as bg from "@bgord/node";
import { z } from "zod";

export const ArticleOldMarker =
  bg.Schema.Timestamp.brand<"article-old-marker">();

export type ArticleOldMarkerType = z.infer<typeof ArticleOldMarker>;
