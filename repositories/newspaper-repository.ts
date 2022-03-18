import * as z from "zod";
import { Prisma, PrismaClient, Newspaper, Article } from "@prisma/client";
import { format, formatDistanceToNow, formatDistanceStrict } from "date-fns";

import * as VO from "../value-objects";
import { Filter } from "../services/filter";

const prisma = new PrismaClient();

export const ArchiveNewspaperFilter = new Filter(
  z.object({ status: VO.NewspaperStatus.optional() })
);

export class NewspaperRepository {
  static async getAll(filters?: Prisma.NewspaperWhereInput) {
    const result = await prisma.newspaper.findMany({
      where: {
        status: filters?.status ?? {
          in: [
            VO.NewspaperStatusEnum.delivered,
            VO.NewspaperStatusEnum.error,
            VO.NewspaperStatusEnum.archived,
          ],
        },
      },
      orderBy: { scheduledAt: "desc" },
      select: {
        id: true,
        status: true,
        scheduledAt: true,
        sentAt: true,
        articles: {
          select: {
            favourite: true,
            id: true,
            source: true,
            status: true,
            title: true,
            url: true,
          },
        },
      },
    });

    return result.map(NewspaperRepository._mapper);
  }

  static async getAllNonArchived() {
    const result = await prisma.newspaper.findMany({
      where: { status: { not: VO.NewspaperStatusEnum.archived } },
      orderBy: { scheduledAt: "desc" },
      select: {
        id: true,
        status: true,
        scheduledAt: true,
        sentAt: true,
        articles: {
          select: {
            favourite: true,
            id: true,
            source: true,
            status: true,
            title: true,
            url: true,
          },
        },
      },
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

  static _mapper(
    newspaper: Newspaper & {
      articles: Omit<Article, "createdAt" | "newspaperId" | "favouritedAt">[];
    }
  ) {
    const sentAtRaw = newspaper.sentAt ?? 0;

    const sentAtFormatted = formatDistanceToNow(sentAtRaw, {
      addSuffix: true,
    });

    return {
      ...newspaper,

      sentAt: {
        raw: sentAtRaw,
        formatted: sentAtRaw === 0 ? null : sentAtFormatted,
      },

      duration: formatDistanceStrict(sentAtRaw, newspaper.scheduledAt),

      title: `Newspaper ${format(newspaper.scheduledAt, "yyyy-MM-dd-hh-mm")}`,
    };
  }
}
