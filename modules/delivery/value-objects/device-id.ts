import * as bg from "@bgord/node";
import { z } from "zod";

export const DeviceId = bg.Schema.UUID;

export type DeviceIdType = z.infer<typeof DeviceId>;
