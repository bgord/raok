import z from "zod";

export const DeviceEmail = z.string().email();
export type DeviceEmailType = z.infer<typeof DeviceEmail>;
