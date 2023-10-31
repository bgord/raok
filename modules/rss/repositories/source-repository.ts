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
}
