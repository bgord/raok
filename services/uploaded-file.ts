import { promises as fs, PathLike } from "fs";

export class UploadedFile {
  static async delete(path: PathLike) {
    return fs.unlink(path);
  }
}
