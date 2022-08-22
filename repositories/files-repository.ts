import z from "zod";
import * as bg from "@bgord/node";
import { Prisma, PrismaClient } from "@prisma/client";
import * as VO from "../value-objects";

const prisma = new PrismaClient();

export const ArchiveFilesFilter = new bg.Filter(
  z.object({ sentAt: VO.TimeStampFilter })
);

export class FilesRepository {
  static async getAll(filters?: Prisma.FilesWhereInput) {
    const files = await prisma.files.findMany({ where: filters });

    return files.map((file) => ({
      ...file,
      sentAt: bg.ComplexDate.falsy(file.sentAt),
    }));
  }

  static async add(file: bg.Schema.UploadedFileType) {
    return prisma.files.create({
      data: {
        name: file.originalFilename,
        size: file.size,
        path: file.path,
        sentAt: Date.now(),
      },
    });
  }
}
