import z from "zod";

export const Token = z.string().min(1);

export type TokenType = z.infer<typeof Token>;
