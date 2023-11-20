import * as bg from "@bgord/node";
import z from "zod";

export const SourceRevision = bg.Schema.Revision.default(0);
export type SourceRevisionType = z.infer<typeof SourceRevision>;
