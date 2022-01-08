import { promises as fs } from "fs";
import { Schema } from "@bgord/node";

export class UploadedFile {
  file: Schema.UploadedFileType;

  constructor(uploadedFile: unknown) {
    this.file = Schema.UploadedFile.parse(uploadedFile);
  }

  async delete() {
    return fs.unlink(this.file.path);
  }
}
