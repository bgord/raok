import { z } from "zod";
import * as bg from "@bgord/node";

export const FileId = bg.Schema.UUID;

export type FileIdType = z.infer<typeof FileId>;
