import * as bg from "@bgord/node";

import * as Reordering from "../../reordering";

import * as VO from "../value-objects";
import * as infra from "../../../infra";

export class SourceRepository {
  static async create(payload: VO.SourceType) {
    await infra.db.source.create({ data: payload });
  }

  static async delete(payload: Pick<VO.SourceType, "id" | "revision">) {
    await infra.db.source.update({
      where: { id: payload.id },
      data: { status: VO.SourceStatusEnum.deleted, revision: payload.revision },
    });
  }

  static async archive(payload: Pick<VO.SourceType, "id" | "revision">) {
    await infra.db.source.update({
      where: { id: payload.id },
      data: {
        status: VO.SourceStatusEnum.inactive,
        revision: payload.revision,
      },
    });
  }

  static async reactivate(payload: Pick<VO.SourceType, "id" | "revision">) {
    await infra.db.source.update({
      where: { id: payload.id },
      data: { status: VO.SourceStatusEnum.active, revision: payload.revision },
    });
  }

  static async bump(payload: Pick<VO.SourceType, "id" | "revision">) {
    await infra.db.source.update({
      where: { id: payload.id },
      data: { revision: payload.revision, updatedAt: Date.now() },
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
      .toSorted(bg.ReorderingIntegrator.sortByPosition());
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
