import { z } from "zod";
import { Schema } from "@bgord/node";

import { Article } from "./article";

export const TableOfContents = z.object({
  id: Schema.UUID,
  contents: z.array(Article.pick({ id: true, url: true })),
});

export type TableOfContentsType = z.infer<typeof TableOfContents>;
