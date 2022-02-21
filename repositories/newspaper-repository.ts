import { PrismaClient, Newspaper, Article } from "@prisma/client";
import { Schema } from "@bgord/node";
import { format, formatDistanceToNow, formatDistanceStrict } from "date-fns";

import * as VO from "../value-objects";

const prisma = new PrismaClient();

export class NewspaperRepository {
  static async getAll(timeZoneOffsetMs: Schema.TimeZoneOffsetType) {
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

    return result.map((newspaper) =>
      NewspaperRepository._mapper(newspaper, timeZoneOffsetMs)
    );
  }

  static async getAllNonArchived(timeZoneOffsetMs: Schema.TimeZoneOffsetType) {
    const result = await prisma.newspaper.findMany({
      where: { status: { not: VO.NewspaperStatusEnum.archived } },
      orderBy: { scheduledAt: "desc" },
      include: { articles: true },
    });

    return result.map((newspaper) =>
      NewspaperRepository._mapper(newspaper, timeZoneOffsetMs)
    );
  }

  static async getById(
    newspaperId: VO.NewspaperIdType,
    timeZoneOffsetMs: Schema.TimeZoneOffsetType
  ) {
    const result = await prisma.newspaper.findFirst({
      where: { id: newspaperId },
      include: { articles: true },
    });

    return result
      ? NewspaperRepository._mapper(result, timeZoneOffsetMs)
      : null;
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
    newspaper: Newspaper & { articles: Article[] },
    timeZoneOffsetMs: Schema.TimeZoneOffsetType
  ) {
    const sentAtRaw = newspaper.sentAt ?? 0;
    const sentAtFormatted = formatDistanceToNow(sentAtRaw + timeZoneOffsetMs, {
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

      articles: newspaper.articles.map((article) => ({
        ...article,
        title: article.title ?? "-",
        description: article.description ?? "-",
      })),
    };
  }
}
