/* eslint-ignore */
import { z } from "zod";
import { SourceStatusEnum } from "./source-status-enum";

export const SourceStatus = z
  .nativeEnum(SourceStatusEnum)
  .default(SourceStatusEnum.active);

export type SourceStatusType = z.infer<typeof SourceStatus>;
