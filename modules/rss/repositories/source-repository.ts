import * as VO from "../value-objects";
import * as infra from "../../../infra";

export class SourceRepository {
  static async create(payload: Pick<VO.SourceType, "url" | "id">) {
    const now = Date.now();

    await infra.db.source.create({
      data: {
        ...payload,
        createdAt: now,
        updatedAt: now,
        status: VO.SourceStatusEnum.active,
      },
    });
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
}
