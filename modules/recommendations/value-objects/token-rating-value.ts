import z from "zod";

const TokenRatingValue = z.number().int().min(-0.5).max(5);

export type TokenRatingValueType = z.infer<typeof TokenRatingValue>;
