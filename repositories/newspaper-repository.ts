import * as z from "zod";
import * as bg from "@bgord/node";
import { format } from "date-fns";

import * as VO from "../value-objects";
import * as infra from "../infra";

export const ArchiveNewspaperFilter = new bg.Filter(
  z.object({
    status: VO.NewspaperStatus.optional(),
    sentAt: VO.TimeStampFilter,
  })
);

export class NewspaperRepository {
  static async getAll(filters?: infra.Prisma.NewspaperWhereInput) {
    const { status, ...rest } = filters ?? {};

    const result = await infra.db.newspaper.findMany({
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
      orderBy: { sentAt: "desc" },
      select: {
        id: true,
        status: true,
        scheduledAt: true,
        sentAt: true,
        articles: {
          select: {
            id: true,
            source: true,
            status: true,
            title: true,
            url: true,
          },
        },
      },
    });

    return result
      .map(NewspaperRepository._mapper)
      .filter((newspaper) => newspaper.articles.length > 0);
  }

  static async getAllNonArchived() {
    const result = await infra.db.newspaper.findMany({
      where: { status: { not: VO.NewspaperStatusEnum.archived } },
      orderBy: { sentAt: "desc" },
      select: {
        id: true,
        status: true,
        scheduledAt: true,
        sentAt: true,
        articles: {
          select: {
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
    const result = await infra.db.newspaper.findFirst({
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
    return infra.db.newspaper.upsert({
      create: newspaper,
      update: { status: newspaper.status },
      where: { id: newspaper.id },
    });
  }

  static async updateStatus(
    newspaperId: VO.NewspaperType["id"],
    status: VO.NewspaperType["status"]
  ) {
    return infra.db.newspaper.updateMany({
      where: { id: newspaperId },
      data: { status },
    });
  }

  static async updateSentAt(
    newspaperId: VO.NewspaperType["id"],
    sentAt: VO.NewspaperType["sentAt"]
  ) {
    return infra.db.newspaper.updateMany({
      where: { id: newspaperId },
      data: { sentAt },
    });
  }

  static _mapper(
    newspaper: infra.Newspaper & {
      articles: Omit<
        infra.Article,
        "createdAt" | "newspaperId" | "favouritedAt"
      >[];
    }
  ) {
    return {
      ...newspaper,
      sentAt: bg.RelativeDate.to.now.falsy(newspaper.sentAt),
      title: `Newspaper ${format(newspaper.scheduledAt, "yyyy-MM-dd-hh-mm")}`,
    };
  }
}
