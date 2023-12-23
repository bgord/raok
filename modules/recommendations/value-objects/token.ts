import z from "zod";

const Token = z.string().min(1);

export type TokenType = z.infer<typeof Token>;
