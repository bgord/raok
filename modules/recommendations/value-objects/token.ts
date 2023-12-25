import z from "zod";

import { TOKEN_MIN_LENGTH } from "./token-min-length";
import { TOKEN_MAX_LENGTH } from "./token-max-length";
import { TOKEN_STRUCTURE_ERROR_KEY } from "./token-structure-error-key";

export const Token = z
  .string()
  .min(TOKEN_MIN_LENGTH, { message: TOKEN_STRUCTURE_ERROR_KEY })
  .max(TOKEN_MAX_LENGTH, { message: TOKEN_STRUCTURE_ERROR_KEY })
  .toLowerCase();

export type TokenType = z.infer<typeof Token>;
