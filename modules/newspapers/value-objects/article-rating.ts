import z from "zod";

export const ArticleRating = z.number().optional();
export type ArticleRatingType = z.infer<typeof ArticleRating>;
