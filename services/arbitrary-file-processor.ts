import path from "path";
import { Schema } from "@bgord/node";

import { EpubToMobiConverter } from "./epub-to-mobi";
import { UploadedFile } from "./uploaded-file";

export class ArbitraryFileProcessor {
  static async process(
    originalFile: Schema.UploadedFileType
  ): Promise<Schema.UploadedFileType> {
    const { ext: extension, name, dir } = path.parse(originalFile.path);

    if (extension === ".mobi") return originalFile;

    if (extension === ".epub") {
      const mobiFileName = `${name}.mobi`;
      const mobiFilePath = `${dir}/${mobiFileName}`;

      await EpubToMobiConverter.convert(originalFile.path, mobiFilePath);
      await new UploadedFile(originalFile).delete();

      return {
        ...originalFile,
        originalFilename: mobiFileName,
        path: mobiFilePath,
      };
    }

    return originalFile;
  }
}
