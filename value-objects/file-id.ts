import * as bg from "@bgord/node";
import { z } from "zod";

export type FileIdType = bg.Brand<"file-id", z.infer<typeof FileIdSchema>>;

const FileIdSchema = bg.Schema.UUID;

export const FileId = bg.toBrand<FileIdType>(FileIdSchema);
