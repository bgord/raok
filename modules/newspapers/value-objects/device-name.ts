import z from "zod";

export const DeviceName = z.string().max(32);
export type DeviceNameType = z.infer<typeof DeviceName>;
