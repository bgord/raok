import z from "zod";
import * as bg from "@bgord/node";

import * as Files from "../";
import * as infra from "../../../infra";

import * as VO from "../../../value-objects";

export const ArchiveFilesFilter = new bg.Filter(
  z.object({ sentAt: VO.TimeStampFilter })
);

export class FilesRepository {
  static async getAll(filters?: infra.Prisma.FilesWhereInput) {
    const files = await infra.db.files.findMany({
      where: filters,
      orderBy: { sentAt: "desc" },
    });

    return files.map((file) => ({
      ...file,
      sentAt: bg.RelativeDate.falsy(file.sentAt),
    }));
  }

  static async getSingle(id: Files.VO.FileIdType) {
    return infra.db.files.findFirst({ where: { id } });
  }

  static async add(file: bg.Schema.UploadedFileType) {
    return infra.db.files.create({
      data: {
        name: file.originalFilename,
        size: file.size,
        path: file.path,
        sentAt: Date.now(),
      },
    });
  }
}
