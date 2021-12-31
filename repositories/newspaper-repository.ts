import { PrismaClient } from "@prisma/client";

import * as VO from "../value-objects";

const prisma = new PrismaClient();

export class NewspaperRepository {
  static async getAll() {
    return (
      await prisma.newspaper.findMany({ orderBy: { scheduledAt: "desc" } })
    ).map((newspaper, index) => ({ ...newspaper, number: index + 1 }));
  }

  static async create(newspaper: {
    id: VO.NewspaperType["id"];
    status: VO.NewspaperType["status"];
    scheduledAt: VO.NewspaperType["scheduledAt"];
  }) {
    return prisma.newspaper.create({ data: newspaper });
  }

  static async updateStatus(
    newspaperId: VO.NewspaperType["id"],
    status: VO.NewspaperType["status"]
  ) {
    return prisma.newspaper.updateMany({
      where: { id: newspaperId },
      data: { status },
    });
  }
}
