import * as bg from "@bgord/node";
import { z } from "zod";

export const SourceId = bg.Schema.UUID;
export type SourceIdType = z.infer<typeof SourceId>;
