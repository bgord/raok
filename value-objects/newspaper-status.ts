import { z } from "zod";

/* eslint-disable no-shadow */
export enum NewspaperStatusEnum {
  /* eslint-disable no-unused-vars */
  "undetermined" = "undetermined",
  "scheduled" = "scheduled",
}

export const NewspaperStatus = z
  .nativeEnum(NewspaperStatusEnum)
  .default(NewspaperStatusEnum.undetermined);

export type NewspaperStatusType = z.infer<typeof NewspaperStatus>;
