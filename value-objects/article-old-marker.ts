import { z } from "zod";

export const ArticleOldMarker = z.number().positive().int();

export type ArticleOldMarkerType = z.infer<typeof ArticleOldMarker>;
