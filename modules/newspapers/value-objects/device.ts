import z from "zod";

import { DeviceId } from "./device-id";
import { DeviceName } from "./device-name";
import { DeviceEmail } from "./device-email";
import { DeviceCreatedAt } from "./device-created-at";

const Device = z.object({
  id: DeviceId,
  name: DeviceName,
  email: DeviceEmail,
  createdAt: DeviceCreatedAt,
});

export type DeviceType = z.infer<typeof Device>;
