import { DeviceRepository } from "../repositories/device-repository";
import { Device } from "./device";

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

    if (this.devices.length >= 5) {
      throw new Error("Maximum number of devices exceeded");
    }

    await DeviceRepository.create(given);
    this.devices.push(given);
  }

  async delete(given: Device) {
    if (!this.devices.some((device) => device.equals(given))) {
      throw new Error("Device does not exist");
    }

    if (this.devices.length < 2) {
      throw new Error("There is only one device left");
    }

    await DeviceRepository.delete(given);
    this.devices.push(given);
  }

  list() {
    return this.devices
      .map((device) => device.read())
      .map((device) => ({ ...device, email: device.email.formatted }));
  }

  getPrimaryDevice(): Device {
    const device = this.devices[0];

    if (!device) {
      throw new Error("No primary device available");
    }

    return device;
  }
}
