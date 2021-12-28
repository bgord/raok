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

export const ARTICLE_ADDED_EVENT = "ARTICLE_ADDED_EVENT";
export const ArticleAddedEvent = EventDraft.merge(
  z.object({
    name: z.literal(ARTICLE_ADDED_EVENT),
    version: z.literal(1),
    payload: z.object({
      id: VO.Article._def.shape().id,
      url: VO.Article._def.shape().url,
      source: VO.Article._def.shape().source,
      createdAt: VO.Article._def.shape().createdAt,
    }),
  })
);
export type ArticleAddedEventType = z.infer<typeof ArticleAddedEvent>;

Emittery.isDebugEnabled = true;

export const emittery = new Emittery<{
  UPDATED_NUMBER_OF_ARTICLES_TO_AUTOSEND_EVENT: UpdatedNumberOfArticlesToAutosendEventType;
  ARTICLE_ADDED_EVENT: ArticleAddedEventType;
}>();
