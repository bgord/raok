import { z } from "zod";

import { SOURCE_URL_MIN_LENGTH } from "./source-url-min-length";
import { SOURCE_URL_MAX_LENGTH } from "./source-url-max-length";
import { SOURCE_URL_STRUCTURE_ERROR_KEY } from "./source-url-structure-error-key";

export const SourceUrl = z
  .string()
  .trim()
  .url()
  .min(SOURCE_URL_MIN_LENGTH, { message: SOURCE_URL_STRUCTURE_ERROR_KEY })
  .max(SOURCE_URL_MAX_LENGTH, { message: SOURCE_URL_STRUCTURE_ERROR_KEY });
export type SourceUrlType = z.infer<typeof SourceUrl>;
