import { z } from "zod";
import { EventDraft } from "@bgord/node";
import Emittery from "emittery";

import * as VO from "./value-objects";
import { Newspaper } from "./aggregates/newspaper";

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

export const ARTICLE_DELETED_EVENT = "ARTICLE_DELETED_EVENT";
export const ArticleDeletedEvent = EventDraft.merge(
  z.object({
    name: z.literal(ARTICLE_DELETED_EVENT),
    version: z.literal(1),
    payload: z.object({ articleId: VO.Article._def.shape().id }),
  })
);
export type ArticleDeletedEventType = z.infer<typeof ArticleDeletedEvent>;

export const NEWSPAPER_SCHEDULED_EVENT = "NEWSPAPER_SCHEDULED_EVENT";
export const NewspaperScheduledEvent = EventDraft.merge(
  z.object({
    name: z.literal(NEWSPAPER_SCHEDULED_EVENT),
    version: z.literal(1),
    payload: VO.TableOfContents,
  })
);
export type NewspaperScheduledEventType = z.infer<
  typeof NewspaperScheduledEvent
>;

Emittery.isDebugEnabled = true;

export const emittery = new Emittery<{
  UPDATED_NUMBER_OF_ARTICLES_TO_AUTOSEND_EVENT: UpdatedNumberOfArticlesToAutosendEventType;
  ARTICLE_ADDED_EVENT: ArticleAddedEventType;
  ARTICLE_DELETED_EVENT: ArticleDeletedEventType;
  NEWSPAPER_SCHEDULED_EVENT: NewspaperScheduledEventType;
}>();

emittery.on(NEWSPAPER_SCHEDULED_EVENT, async (event) => {
  const newspaper = await new Newspaper(event.payload.id).build();

  await newspaper.generate();
});
