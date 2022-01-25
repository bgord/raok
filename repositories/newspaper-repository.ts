import { PrismaClient } from "@prisma/client";

import * as VO from "../value-objects";

const prisma = new PrismaClient();

export class NewspaperRepository {
  static async getAll() {
    return prisma.newspaper.findMany({
      where: {
        status: {
          in: [
            VO.NewspaperStatusEnum.delivered,
            VO.NewspaperStatusEnum.error,
            VO.NewspaperStatusEnum.archived,
          ],
        },
      },
      orderBy: { scheduledAt: "desc" },
      include: { articles: true },
    });
  }

  static async getAllNonArchived() {
    return prisma.newspaper.findMany({
      where: { status: { not: VO.NewspaperStatusEnum.archived } },
      orderBy: { scheduledAt: "desc" },
      include: { articles: true },
    });
  }

  static async getById(newspaperId: VO.NewspaperIdType) {
    return prisma.newspaper.findFirst({
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
