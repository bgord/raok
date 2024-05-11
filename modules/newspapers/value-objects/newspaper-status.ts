import { z } from "zod";

export enum NewspaperStatusEnum {
  undetermined = "undetermined",
  scheduled = "scheduled",
  ready_to_send = "ready_to_send",
  delivered = "delivered",
  archived = "archived",
  error = "error",
}

export const NewspaperStatus = z
  .nativeEnum(NewspaperStatusEnum)
  .default(NewspaperStatusEnum.undetermined);
