import z from "zod";

export const DeviceEmail = z.string().email();
