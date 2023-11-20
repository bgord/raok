import * as bg from "@bgord/node";
import z from "zod";

export const NewspaperRevision = bg.Schema.Revision.default(0);
export type NewspaperRevisionType = z.infer<typeof NewspaperRevision>;
