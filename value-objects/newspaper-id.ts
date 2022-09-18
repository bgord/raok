import * as bg from "@bgord/node";
import { z } from "zod";

export type NewspaperIdType = z.infer<typeof NewspaperId>;

export const NewspaperId = bg.Schema.UUID.brand<"newspaper-id">();
