import { z } from "zod";
import { Schema, Brand, toBrand } from "@bgord/node";

export type NewspaperIdType = Brand<
  "newspaper-id",
  z.infer<typeof NewspaperIdSchema>
>;

const NewspaperIdSchema = Schema.UUID;

export const NewspaperId = toBrand<NewspaperIdType>(NewspaperIdSchema);
