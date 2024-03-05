import * as bg from "@bgord/node";
import { z } from "zod";

export const FileId = bg.Schema.UUID.brand<"file-id">();

export type FileIdType = z.infer<typeof FileId>;
