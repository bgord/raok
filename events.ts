import { z } from "zod";
import { EventDraft } from "@bgord/node";
import Emittery from "emittery";

import * as VO from "./value-objects";

export const UPDATED_NUMBER_OF_ARTICLES_TO_AUTOSEND_EVENT =
  "UPDATED_NUMBER_OF_ARTICLES_TO_AUTOSEND_EVENT";
export const UpdatedNumberOfArticlesToAutosendEvent = EventDraft.merge(
  z.object({
    name: z.literal(UPDATED_NUMBER_OF_ARTICLES_TO_AUTOSEND_EVENT),
    version: z.literal(1),
    payload: z.object({
      numberOfArticlesToAutosend: VO.NumberOfArticlesToAutosend,
    }),
  })
);
export type UpdatedNumberOfArticlesToAutosendEventType = z.infer<
  typeof UpdatedNumberOfArticlesToAutosendEvent
>;

Emittery.isDebugEnabled = true;

export const emittery = new Emittery<{
  UPDATED_NUMBER_OF_ARTICLES_TO_AUTOSEND_EVENT: UpdatedNumberOfArticlesToAutosendEventType;
}>();
