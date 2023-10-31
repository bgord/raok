import * as bg from "@bgord/node";
import z from "zod";

export const SourceUpdatedAt = bg.Schema.Timestamp;
export type SourceUpdatedAtType = z.infer<typeof SourceUpdatedAt>;
