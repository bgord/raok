import * as bg from "@bgord/node";
import z from "zod";

export const ArticleRevision = bg.Schema.Revision.default(0);
export type ArticleRevisionType = z.infer<typeof ArticleRevision>;
