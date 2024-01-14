import z from "zod";
import _ from "lodash";
import * as bg from "@bgord/node";

import * as Reordering from "../../reordering";

import * as VO from "../value-objects";
import * as infra from "../../../infra";
import * as Services from "../services";

export const SourceFilter = new bg.Filter(
  z.object({ status: VO.SourceStatus.optional() })
);

export class SourceRepository {
  static async create(payload: infra.Source) {
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
    return infra.db.source.findUnique({ where });
  }

  static async countUrl(where: Pick<VO.SourceType, "url">) {
    return infra.db.source.count({
      where: { ...where, status: { not: VO.SourceStatusEnum.deleted } },
    });
  }

  static async listAll(_filters?: infra.Prisma.SourceWhereInput) {
    const filters = _.isEmpty(_filters)
      ? { status: { not: VO.SourceStatusEnum.deleted } }
      : _filters;

    const sources = await infra.db.source.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
    });

    const reordering = await Reordering.Repos.ReorderingRepository.list(
      "sources"
    );

    return sources
      .map(SourceRepository.map)
      .map(bg.ReorderingIntegrator.appendPosition(reordering))
      .toSorted(bg.ReorderingIntegrator.sortByPosition());
  }

  static async listActive() {
    const sources = await infra.db.source.findMany({
      where: { status: VO.SourceStatusEnum.active },
      orderBy: { createdAt: "desc" },
    });

    return sources.map(SourceRepository.map);
  }

  static async updateMetadata(
    id: VO.SourceIdType,
    metadata: Services.SourceMetadataType
  ) {
    await infra.db.source.update({ where: { id }, data: metadata });
  }

  private static map(item: infra.Source) {
    return {
      ...item,
      createdAt: bg.RelativeDate.truthy(item.createdAt),
      updatedAt: bg.RelativeDate.truthy(item.updatedAt),
    };
  }
}
