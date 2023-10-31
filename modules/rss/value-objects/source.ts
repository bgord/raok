import z from "zod";

import { SourceCreatedAt } from "./source-created-at";
import { SourceUpdatedAt } from "./source-updated-at";
import { SourceUrl } from "./source-url";
import { SourceId } from "./source-id";
import { SourceStatus } from "./source-status";

export const Source = z.object({
  createdAt: SourceCreatedAt,
  updatedAt: SourceUpdatedAt,
  url: SourceUrl,
  id: SourceId,
  status: SourceStatus,
});
export type SourceType = z.infer<typeof Source>;
