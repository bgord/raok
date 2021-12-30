import { PrismaClient } from "@prisma/client";

import * as VO from "../value-objects";

const prisma = new PrismaClient();

export class NewspaperRepository {
  static async getAll() {
    return prisma.newspaper.findMany();
  }

  static async create(newspaper: {
    id: VO.NewspaperType["id"];
    status: VO.NewspaperType["status"];
    scheduledAt: VO.NewspaperType["scheduledAt"];
  }) {
    return prisma.newspaper.create({ data: newspaper });
  }

  static async updateStatus(
    id: VO.NewspaperType["id"],
    status: VO.NewspaperType["status"]
  ) {
    return prisma.newspaper.update({
      where: { id },
      data: { status },
    });
  }
}
