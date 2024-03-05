import * as bg from "@bgord/node";
import { z } from "zod";

import * as VO from "../delivery/value-objects";

export const ARBITRARY_FILE_SCHEDULED_EVENT = "ARBITRARY_FILE_SCHEDULED_EVENT";
export const ArbitraryFileScheduledEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARBITRARY_FILE_SCHEDULED_EVENT),
    version: z.literal(1),
    payload: bg.Schema.UploadedFile.merge(z.object({ email: VO.DeviceEmail })),
  }),
);
export type ArbitraryFileScheduledEventType = z.infer<
  typeof ArbitraryFileScheduledEvent
>;
