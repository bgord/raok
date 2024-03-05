import * as VO from "../value-objects";
import { DeviceRepository } from "../repositories/device-repository";

export class Device {
  constructor(readonly specification: VO.DeviceType) {}

  equals(another: Device): boolean {
    return this.specification.id === another.specification.id;
  }

  matches(another: Device): boolean {
    return (
      this.specification.id === another.specification.id ||
      this.specification.email === another.specification.email ||
      this.specification.name === another.specification.name
    );
  }

  static async build(id: VO.DeviceIdType): Promise<Device> {
    const device = await DeviceRepository.getById({ id });

    if (!device) {
      throw new Error("Device not found");
    }

    return new Device(device);
  }
}
