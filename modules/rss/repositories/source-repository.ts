import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as infra from "../../../infra";

export class SourceRepository {
  static async create(payload: VO.SourceType) {
    await infra.db.source.create({ data: payload });
  }

  static async delete(where: Pick<VO.SourceType, "id">) {
    await infra.db.source.update({
      where,
      data: { status: VO.SourceStatusEnum.deleted, updatedAt: Date.now() },
    });
  }

  static async archive(where: Pick<VO.SourceType, "id">) {
    await infra.db.source.update({
      where,
      data: { status: VO.SourceStatusEnum.inactive, updatedAt: Date.now() },
    });
  }

  static async reactivate(where: Pick<VO.SourceType, "id">) {
    await infra.db.source.update({
      where,
      data: { status: VO.SourceStatusEnum.active, updatedAt: Date.now() },
    });
  }

  static async getById(where: Pick<VO.SourceType, "id">) {
    return infra.db.source.findFirst({ where });
  }

  static async countUrl(where: Pick<VO.SourceType, "url">) {
    return infra.db.source.count({
      where: { ...where, status: { not: VO.SourceStatusEnum.deleted } },
    });
  }

  static async listAll() {
    const sources = await infra.db.source.findMany({
      where: { status: { not: VO.SourceStatusEnum.deleted } },
      orderBy: { createdAt: "desc" },
    });

    return sources
      .map((item) => VO.Source.parse(item))
      .map(SourceRepository.map)
      .sort((a, b) => {
        const statusToOrder: Record<VO.SourceStatusEnum, number> = {
          [VO.SourceStatusEnum.active]: 1,
          [VO.SourceStatusEnum.inactive]: 2,
          [VO.SourceStatusEnum.deleted]: 3,
        };

        if (statusToOrder[a.status] < statusToOrder[b.status]) return -1;
        if (statusToOrder[a.status] > statusToOrder[b.status]) return 1;
        return 0;
      });
  }

  static async listActive() {
    const sources = await infra.db.source.findMany({
      where: { status: VO.SourceStatusEnum.active },
      orderBy: { createdAt: "desc" },
    });

    return sources
      .map((item) => VO.Source.parse(item))
      .map(SourceRepository.map);
  }

  private static map(item: VO.SourceType) {
    return {
      ...item,
      createdAt: bg.RelativeDate.truthy(item.createdAt),
      updatedAt: bg.RelativeDate.truthy(item.updatedAt),
    };
  }
}
