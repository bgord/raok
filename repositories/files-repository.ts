import z from "zod";
import * as bg from "@bgord/node";
import { Prisma, PrismaClient } from "@prisma/client";
import * as VO from "../value-objects";

const prisma = new PrismaClient();

export const ArchiveFilesFilter = new bg.Filter(
  z.object({
    sentAt: VO.TimeStampFilter,
  })
);

export class FilesRepository {
  static async getAll(filters?: Prisma.FilesWhereInput) {
    return prisma.files.findMany({ where: filters });
  }

  static async add(
    file: Pick<bg.Schema.UploadedFileType, "path" | "originalFilename" | "size">
  ) {
    return prisma.files.create({
      data: { ...file, name: file.originalFilename },
    });
  }
}
