import z from "zod";
import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import { TimeStampFilter } from "../../newspapers/value-objects";

import * as infra from "../../../infra";

export const ArchiveFilesFilter = new bg.Filter(
  z.object({ sentAt: TimeStampFilter }),
);

export class FilesRepository {
  static async getAll(filters?: infra.Prisma.FilesWhereInput) {
    const files = await infra.db.files.findMany({
      where: filters,
      orderBy: { sentAt: "desc" },
    });

    return files.map((file) => ({
      ...file,
      sentAt: bg.RelativeDate.falsy(Number(file.sentAt)),
    }));
  }

  static async getSingle(id: VO.FileIdType) {
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
