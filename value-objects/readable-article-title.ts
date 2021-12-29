import { z } from "zod";

export const ReadableArticleTitle = z.string().max(256);

export type ReadableArticleTitleType = z.infer<typeof ReadableArticleTitle>;
