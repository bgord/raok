import { z } from "zod";
import { Schema } from "@bgord/node";

import { Brand, toBrand } from "./_brand";

export type NewspaperIdType = Brand<
  "newspaper-id",
  z.infer<typeof NewspaperIdSchema>
>;

const NewspaperIdSchema = Schema.UUID;

export const NewspaperId = toBrand<NewspaperIdType>(NewspaperIdSchema);
