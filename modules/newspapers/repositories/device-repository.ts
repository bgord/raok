import * as infra from "../../../infra";
import * as VO from "../value-objects";
import { Device } from "../services/device";

export class DeviceRepository {
  static async create(device: Device) {
    const data = device.read();

    await infra.db.device.create({
      data: {
        id: data.id,
        email: data.email.raw,
        name: data.name,
        createdAt: Date.now(),
      },
    });
  }

  static async list() {
    return infra.db.device.findMany({ orderBy: { createdAt: "asc" } });
  }

  static async delete(device: Device) {
    const { id } = device.read();
    await infra.db.device.delete({ where: { id } });
  }

  static async getById(where: Pick<VO.DeviceType, "id">) {
    return infra.db.device.findUnique({ where });
  }
}
