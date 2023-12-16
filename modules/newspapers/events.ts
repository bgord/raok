import * as bg from "@bgord/node";
import { z } from "zod";

import * as VO from "../newspapers/value-objects";

export const ARTICLE_ADDED_EVENT = "ARTICLE_ADDED_EVENT";
export const ArticleAddedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLE_ADDED_EVENT),
    version: z.literal(1),
    payload: VO.Article.merge(VO.ArticleMetatags),
  })
);
export type ArticleAddedEventType = z.infer<typeof ArticleAddedEvent>;

export const ARTICLE_DELETED_EVENT = "ARTICLE_DELETED_EVENT";
export const ArticleDeletedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLE_DELETED_EVENT),
    version: z.literal(1),
    payload: z.object({
      articleId: VO.ArticleId,
      revision: VO.ArticleRevision,
    }),
  })
);
export type ArticleDeletedEventType = z.infer<typeof ArticleDeletedEvent>;

export const ARTICLE_READ_EVENT = "ARTICLE_READ_EVENT";
export const ArticleReadEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLE_READ_EVENT),
    version: z.literal(1),
    payload: z.object({
      articleId: VO.ArticleId,
      revision: VO.ArticleRevision,
    }),
  })
);
export type ArticleReadEventType = z.infer<typeof ArticleReadEvent>;

export const ARTICLE_LOCKED_EVENT = "ARTICLE_LOCKED_EVENT";
export const ArticleLockedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLE_LOCKED_EVENT),
    version: z.literal(1),
    payload: z.object({
      articleId: VO.ArticleId,
      newspaperId: VO.NewspaperId,
      revision: VO.ArticleRevision,
    }),
  })
);
export type ArticleLockedEventType = z.infer<typeof ArticleLockedEvent>;

export const ARTICLE_UNLOCKED_EVENT = "ARTICLE_UNLOCKED_EVENT";
export const ArticleUnlockedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLE_UNLOCKED_EVENT),
    version: z.literal(1),
    payload: z.object({
      articleId: VO.ArticleId,
      revision: VO.ArticleRevision,
    }),
  })
);
export type ArticleUnlockedEventType = z.infer<typeof ArticleUnlockedEvent>;

export const ARTICLE_PROCESSED_EVENT = "ARTICLE_PROCESSED_EVENT";
export const ArticleProcessedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLE_PROCESSED_EVENT),
    version: z.literal(1),
    payload: z.object({
      articleId: VO.ArticleId,
      revision: VO.ArticleRevision,
    }),
  })
);
export type ArticleProcessedEventType = z.infer<typeof ArticleProcessedEvent>;

export const ARTICLE_UNDELETE_EVENT = "ARTICLE_UNDELETE_EVENT";
export const ArticleUndeleteEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLE_UNDELETE_EVENT),
    version: z.literal(1),
    payload: z.object({
      articleId: VO.ArticleId,
      revision: VO.ArticleRevision,
    }),
  })
);
export type ArticleUndeleteEventType = z.infer<typeof ArticleUndeleteEvent>;

export const NEWSPAPER_SCHEDULED_EVENT = "NEWSPAPER_SCHEDULED_EVENT";
export const NewspaperScheduledEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(NEWSPAPER_SCHEDULED_EVENT),
    version: z.literal(1),
    payload: z.object({
      id: VO.NewspaperId,
      articles: VO.Newspaper._def.shape().articles,
      createdAt: bg.Schema.Timestamp,
      revision: VO.NewspaperRevision,
    }),
  })
);
export type NewspaperScheduledEventType = z.infer<
  typeof NewspaperScheduledEvent
>;

export const NEWSPAPER_GENERATED_EVENT = "NEWSPAPER_GENERATED_EVENT";
export const NewspaperGenerateEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(NEWSPAPER_GENERATED_EVENT),
    version: z.literal(1),
    payload: z.object({
      newspaperId: VO.NewspaperId,
      revision: VO.NewspaperRevision,
    }),
  })
);
export type NewspaperGenerateEventType = z.infer<typeof NewspaperGenerateEvent>;

export const NEWSPAPER_SENT_EVENT = "NEWSPAPER_SENT_EVENT";
export const NewspaperSentEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(NEWSPAPER_SENT_EVENT),
    version: z.literal(1),
    payload: z.object({
      newspaperId: VO.NewspaperId,
      articles: VO.Newspaper._def.shape().articles,
      sentAt: VO.Newspaper._def.shape().sentAt,
      revision: VO.NewspaperRevision,
    }),
  })
);
export type NewspaperSentEventType = z.infer<typeof NewspaperSentEvent>;

export const NEWSPAPER_ARCHIVED_EVENT = "NEWSPAPER_ARCHIVED_EVENT";
export const NewspaperArchivedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(NEWSPAPER_ARCHIVED_EVENT),
    version: z.literal(1),
    payload: z.object({
      newspaperId: VO.NewspaperId,
      revision: VO.NewspaperRevision,
    }),
  })
);
export type NewspaperArchivedEventType = z.infer<typeof NewspaperArchivedEvent>;

export const NEWSPAPER_FAILED_EVENT = "NEWSPAPER_FAILED_EVENT";
export const NewspaperFailedEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(NEWSPAPER_FAILED_EVENT),
    version: z.literal(1),
    payload: z.object({
      newspaperId: VO.NewspaperId,
      revision: VO.NewspaperRevision,
    }),
  })
);
export type NewspaperFailedEventType = z.infer<typeof NewspaperFailedEvent>;
