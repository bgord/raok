import { z } from "zod";

export const ArticleUrl = z.string().trim().url().brand<"article-url">();

export type ArticleUrlType = z.infer<typeof ArticleUrl>;
