import _ from "lodash";
import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as infra from "../../../infra";
import { SourceQualityAlarm, SourceMetadataType } from "../services";

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

  static async listAll() {
    const sources = await infra.db.source.findMany({
      where: { status: VO.SourceStatusEnum.active },
      orderBy: { updatedAt: "desc" },
    });

    return sources.map(SourceRepository.map);
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
    metadata: Partial<SourceMetadataType>,
  ) {
    await infra.db.source.update({ where: { id }, data: metadata });
  }

  private static map(item: infra.Source) {
    return {
      ...item,
      createdAt: bg.RelativeDate.truthy(Number(item.createdAt)),
      updatedAt: bg.RelativeDate.truthy(Number(item.updatedAt)),
      processedUntil: bg.RelativeDate.truthy(Number(item.processedUntil)),
      isQualityAlarming: SourceQualityAlarm.isAlarming(
        item.quality,
        item.countValue,
      ),
    };
  }
}
