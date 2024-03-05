import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import { DeviceRepository } from "../repositories/device-repository";

export class Device {
  constructor(private readonly specification: VO.DeviceType) {}

  static async build(id: VO.DeviceIdType): Promise<Device> {
    const device = await DeviceRepository.getById({ id });

    if (!device) {
      throw new Error("Device not found");
    }

    return new Device(device);
  }

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

  read() {
    return {
      id: this.specification.id,
      email: {
        raw: this.specification.email,
        formatted: bg.EmailCensor.censor(this.specification.email),
      },
      name: this.specification.name,
    };
  }
}
