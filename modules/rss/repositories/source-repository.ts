import * as bg from "@bgord/node";

import * as Reordering from "../../reordering";

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

    const reordering = await Reordering.Repos.ReorderingRepository.list(
      "sources"
    );

    return sources
      .map((item) => VO.Source.parse(item))
      .map(SourceRepository.map)
      .map(bg.ReorderingIntegrator.appendPosition(reordering))
      .sort(bg.ReorderingIntegrator.sortByPosition());
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
