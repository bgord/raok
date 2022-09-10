import * as z from "zod";
import * as bg from "@bgord/node";
import { format, formatDistanceStrict } from "date-fns";

import { Prisma, db } from "../db";
import * as VO from "../value-objects";

export const ArchiveNewspaperFilter = new bg.Filter(
  z.object({
    status: VO.NewspaperStatus.optional(),
    sentAt: VO.TimeStampFilter,
  })
);

export class NewspaperRepository {
  static async getAll(filters?: Prisma.NewspaperWhereInput) {
    const { status, ...rest } = filters ?? {};

    const result = await db.newspaper.findMany({
      where: {
        status: filters?.status ?? {
          in: [
            VO.NewspaperStatusEnum.delivered,
            VO.NewspaperStatusEnum.error,
            VO.NewspaperStatusEnum.archived,
          ],
        },
        ...rest,
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
    const result = await db.newspaper.findMany({
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
    const result = await db.newspaper.findFirst({
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
    return db.newspaper.upsert({
      create: newspaper,
      update: { status: newspaper.status },
      where: { id: newspaper.id },
    });
  }

  static async updateStatus(
    newspaperId: VO.NewspaperType["id"],
    status: VO.NewspaperType["status"]
  ) {
    return db.newspaper.updateMany({
      where: { id: newspaperId },
      data: { status },
    });
  }

  static async updateSentAt(
    newspaperId: VO.NewspaperType["id"],
    sentAt: VO.NewspaperType["sentAt"]
  ) {
    return db.newspaper.updateMany({
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

    return {
      ...newspaper,
      sentAt: bg.ComplexDate.falsy(newspaper.sentAt),
      duration: formatDistanceStrict(sentAtRaw, newspaper.scheduledAt),
      title: `Newspaper ${format(newspaper.scheduledAt, "yyyy-MM-dd-hh-mm")}`,
    };
  }
}
