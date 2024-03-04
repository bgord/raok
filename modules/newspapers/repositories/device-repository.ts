import * as infra from "../../../infra";
import * as VO from "../value-objects";

export class DeviceRepository {
  static async create(data: VO.DeviceType) {
    await infra.db.device.create({ data });
  }

  static async list() {
    return infra.db.device.findMany({ orderBy: { createdAt: "asc" } });
  }

  static async delete(id: VO.DeviceIdType) {
    await infra.db.device.delete({ where: { id } });
  }

  static async getById(where: Pick<VO.DeviceType, "id">) {
    return infra.db.device.findUnique({ where });
  }
}
