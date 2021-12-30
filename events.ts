import { z } from "zod";
import { EventDraft } from "@bgord/node";
import Emittery from "emittery";

import * as VO from "./value-objects";
import * as Services from "./services";
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

export const NEWSPAPER_GENERATED_EVENT = "NEWSPAPER_GENERATED_EVENT";
export const NewspaperGenerateEvent = EventDraft.merge(
  z.object({
    name: z.literal(NEWSPAPER_GENERATED_EVENT),
    version: z.literal(1),
    payload: z.object({ newspaperId: VO.Newspaper._def.shape().id }),
  })
);
export type NewspaperGenerateEventType = z.infer<typeof NewspaperGenerateEvent>;

export const NEWSPAPER_SENT_EVENT = "NEWSPAPER_SENT_EVENT";
export const NewspaperSentEvent = EventDraft.merge(
  z.object({
    name: z.literal(NEWSPAPER_SENT_EVENT),
    version: z.literal(1),
    payload: z.object({ newspaperId: VO.Newspaper._def.shape().id }),
  })
);
export type NewspaperSentEventType = z.infer<typeof NewspaperSentEvent>;

Emittery.isDebugEnabled = true;

export const emittery = new Emittery<{
  UPDATED_NUMBER_OF_ARTICLES_TO_AUTOSEND_EVENT: UpdatedNumberOfArticlesToAutosendEventType;
  ARTICLE_ADDED_EVENT: ArticleAddedEventType;
  ARTICLE_DELETED_EVENT: ArticleDeletedEventType;
  NEWSPAPER_SCHEDULED_EVENT: NewspaperScheduledEventType;
  NEWSPAPER_GENERATED_EVENT: NewspaperGenerateEventType;
  NEWSPAPER_SENT_EVENT: NewspaperSentEventType;
}>();

emittery.on(NEWSPAPER_SCHEDULED_EVENT, async (event) => {
  const newspaper = await new Newspaper(event.payload.id).build();
  await newspaper.generate();
});

emittery.on(NEWSPAPER_GENERATED_EVENT, async (event) => {
  const newspaper = await new Newspaper(event.payload.newspaperId).build();
  await newspaper.send();
});

emittery.on(NEWSPAPER_SENT_EVENT, async (event) => {
  await Services.NewspaperFile.delete(event.payload.newspaperId);
});
