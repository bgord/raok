import z from "zod";

import { DEVICE_NAME_MAX_LENGTH } from "./device-name-max-length";

export const DeviceName = z.string().max(DEVICE_NAME_MAX_LENGTH);
export type DeviceNameType = z.infer<typeof DeviceName>;
