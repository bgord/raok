import z from "zod";

export const ArticleRating = z.number().optional().nullish();
export type ArticleRatingType = z.infer<typeof ArticleRating>;
