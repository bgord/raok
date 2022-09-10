import z from "zod";
import * as bg from "@bgord/node";
import { db, Prisma } from "../db";

import * as VO from "../value-objects";

export const ArchiveFilesFilter = new bg.Filter(
  z.object({ sentAt: VO.TimeStampFilter })
);

export class FilesRepository {
  static async getAll(filters?: Prisma.FilesWhereInput) {
    const files = await db.files.findMany({ where: filters });

    return files.map((file) => ({
      ...file,
      sentAt: bg.ComplexDate.falsy(file.sentAt),
    }));
  }

  static async getSingle(id: VO.FileIdType) {
    return db.files.findFirst({ where: { id } });
  }

  static async add(file: bg.Schema.UploadedFileType) {
    return db.files.create({
      data: {
        name: file.originalFilename,
        size: file.size,
        path: file.path,
        sentAt: Date.now(),
      },
    });
  }
}
