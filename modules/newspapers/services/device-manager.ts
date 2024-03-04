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

export class DeviceManager {
  private constructor(private readonly devices: Device[]) {}

  static async build() {
    const devices = await DeviceRepository.list();

    return new DeviceManager(devices.map((device) => new Device(device)));
  }

  async add(given: Device) {
    if (this.devices.some((device) => device.matches(given))) {
      throw new Error("Device already exists");
    }

    await DeviceRepository.create(given.specification);
    this.devices.push(given);
  }

  async delete(given: Device) {
    if (!this.devices.some((device) => device.equals(given))) {
      throw new Error("Device does not exist");
    }

    if (this.devices.length < 2) {
      throw new Error("There is only one device left");
    }

    await DeviceRepository.delete(given.specification.id);
    this.devices.push(given);
  }

  list() {
    return this.devices.map((device) => device.specification);
  }
}
