import * as infra from "../../../infra";
import * as VO from "../value-objects";

export class DeviceRepository {
  static async create(payload: Omit<VO.DeviceType, "createdAt">) {
    await infra.db.device.create({
      data: { ...payload, createdAt: Date.now() },
    });
  }

  static async list() {
    return infra.db.device.findMany({ orderBy: { createdAt: "asc" } });
  }

  static async delete(id: VO.DeviceIdType) {
    await infra.db.device.delete({ where: { id } });
  }
}
