import { PrismaClient, Newspaper, Article } from "@prisma/client";
import { format } from "date-fns";

import * as VO from "../value-objects";

const prisma = new PrismaClient();

export class NewspaperRepository {
  static async getAll() {
    const result = await prisma.newspaper.findMany({
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

    return result.map(NewspaperRepository._mapper);
  }

  static async getAllNonArchived() {
    const result = await prisma.newspaper.findMany({
      where: { status: { not: VO.NewspaperStatusEnum.archived } },
      orderBy: { scheduledAt: "desc" },
      include: { articles: true },
    });

    return result.map(NewspaperRepository._mapper);
  }

  static async getById(newspaperId: VO.NewspaperIdType) {
    const result = await prisma.newspaper.findFirst({
      where: { id: newspaperId },
      include: { articles: true },
    });

    return result ? NewspaperRepository._mapper(result) : null;
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

  static _mapper(newspaper: Newspaper & { articles: Article[] }) {
    return {
      ...newspaper,
      title: `Newspaper ${format(newspaper.scheduledAt, "yyyy-MM-dd-hh-mm")}`,
      articles: newspaper.articles.map((article) => ({
        ...article,
        title: article.title ?? "-",
        description: article.description ?? "-",
      })),
    };
  }
}
