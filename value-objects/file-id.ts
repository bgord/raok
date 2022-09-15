import * as bg from "@bgord/node";
import { z } from "zod";
import { Brand, toBrand } from "../brand";

export type FileIdType = Brand<"file-id", z.infer<typeof FileIdSchema>>;

const FileIdSchema = bg.Schema.UUID;

export const FileId = toBrand<FileIdType>(FileIdSchema);
