import z from "zod";

import { TOKEN_MIN_LENGTH } from "./token-min-length";
import { TOKEN_MAX_LENGTH } from "./token-max-length";

export const Token = z.string().min(TOKEN_MIN_LENGTH).max(TOKEN_MAX_LENGTH);

export type TokenType = z.infer<typeof Token>;
