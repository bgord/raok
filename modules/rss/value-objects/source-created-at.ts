import * as bg from "@bgord/node";
import z from "zod";

export const SourceCreatedAt = bg.Schema.Timestamp;
export type SourceCreatedAtType = z.infer<typeof SourceCreatedAt>;
