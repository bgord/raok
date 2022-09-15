import * as bg from "@bgord/node";
import { z } from "zod";

export type NewspaperIdType = bg.Brand<
  "newspaper-id",
  z.infer<typeof NewspaperIdSchema>
>;

const NewspaperIdSchema = bg.Schema.UUID;

export const NewspaperId = bg.toBrand<NewspaperIdType>(NewspaperIdSchema);
