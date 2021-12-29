import { z } from "zod";

export const ArticleContent = z.string().max(100000);

export type ArticleContentType = z.infer<typeof ArticleContent>;
