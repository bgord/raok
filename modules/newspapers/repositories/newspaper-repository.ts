import * as bg from "@bgord/node";
import { format } from "date-fns";

import * as VO from "../value-objects";
import * as infra from "../../../infra";

export class NewspaperRepository {
  static async getAllNonArchived() {
    const result = await infra.db.newspaper.findMany({
      where: { status: { not: VO.NewspaperStatusEnum.archived } },
      orderBy: { sentAt: "desc" },
      include: { articles: true },
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

  static async create(
    newspaper: Pick<VO.NewspaperType, "id" | "status" | "scheduledAt">
  ) {
    return infra.db.newspaper.upsert({
      create: newspaper,
      update: { status: newspaper.status },
      where: { id: newspaper.id },
    });
  }

  static async updateStatus(
    payload: Pick<VO.NewspaperType, "id" | "status" | "revision">
  ) {
    return infra.db.newspaper.updateMany({
      where: { id: payload.id },
      data: { status: payload.status, revision: payload.revision },
    });
  }

  static async updateSentAt(
    payload: Pick<VO.NewspaperType, "id" | "sentAt" | "revision">
  ) {
    return infra.db.newspaper.updateMany({
      where: { id: payload.id },
      data: { sentAt: payload.sentAt, revision: payload.revision },
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
      scheduledAt: Number(newspaper.scheduledAt),
      sentAt: bg.RelativeDate.falsy(Number(newspaper.sentAt)),
      title: `Newspaper ${format(
        Number(newspaper.scheduledAt),
        "yyyy-MM-dd-hh-mm"
      )}`,
    };
  }
}
