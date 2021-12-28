import { z } from "zod";

export const ArticleUrl = z.string().url();

export type ArticleUrlType = z.infer<typeof ArticleUrl>;
