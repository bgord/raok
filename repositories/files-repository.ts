import * as bg from "@bgord/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class FilesRepository {
  static async getAll() {
    return prisma.files.findMany();
  }

  static async add(
    file: Pick<bg.Schema.UploadedFileType, "path" | "originalFilename" | "size">
  ) {
    return prisma.files.create({
      data: { ...file, name: file.originalFilename },
    });
  }
}
