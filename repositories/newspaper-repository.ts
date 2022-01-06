import { PrismaClient } from "@prisma/client";

import * as VO from "../value-objects";

const prisma = new PrismaClient();

export class NewspaperRepository {
  static async getAll() {
    return (
      await prisma.newspaper.findMany({
        orderBy: { scheduledAt: "desc" },
        include: { articles: true },
      })
    ).map((newspaper, index, newspapers) => ({
      ...newspaper,
      number: newspapers.length - index,
    }));
  }

  static async getById(newspaperId: VO.NewspaperIdType) {
    return await prisma.newspaper.findFirst({
      where: { id: newspaperId },
      include: { articles: true },
    });
  }

  static async create(newspaper: {
    id: VO.NewspaperType["id"];
    status: VO.NewspaperType["status"];
    scheduledAt: VO.NewspaperType["scheduledAt"];
  }) {
    return prisma.newspaper.upsert({
      create: newspaper,
      update: { status: newspaper.status },
      where: { id: newspaper.id },
    });
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

  static async updateSentAt(
    newspaperId: VO.NewspaperType["id"],
    sentAt: VO.NewspaperType["sentAt"]
  ) {
    return prisma.newspaper.updateMany({
      where: { id: newspaperId },
      data: { sentAt },
    });
  }
}
