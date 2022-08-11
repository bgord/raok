import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { EventType } from "@bgord/node";

import * as Events from "../events";

const prisma = new PrismaClient();

type AcceptedEvent =
  | typeof Events.ArticleAddedEvent
  | typeof Events.ArticleAddedToFavouritesEvent
  | typeof Events.ArticleDeletedEvent
  | typeof Events.ArticleDeletedFromFavouritesEvent
  | typeof Events.ArticleLockedEvent
  | typeof Events.ArticleProcessedEvent
  | typeof Events.ArticleUndeleteEvent
  | typeof Events.ArticlesToReviewNotificationHourSetEvent
  | typeof Events.ArticlesToReviewNotificationsDisabledEvent
  | typeof Events.ArticlesToReviewNotificationsEnabledEvent
  | typeof Events.FeedlyArticlesCrawlingScheduledEvent
  | typeof Events.NewspaperArchivedEvent
  | typeof Events.NewspaperFailedEvent
  | typeof Events.NewspaperGenerateEvent
  | typeof Events.NewspaperScheduledEvent
  | typeof Events.NewspaperSentEvent
  | typeof Events.DeleteOldArticlesEvent
  | typeof Events.StopFeedlyCrawlingEvent
  | typeof Events.RestoreFeedlyCrawlingEvent;
type AcceptedEventType = z.infer<AcceptedEvent>;

export class EventRepository {
  static async find<T extends AcceptedEvent[]>(
    acceptedEvents: T,
    stream?: EventType["stream"]
  ): Promise<z.infer<T[0]>[]> {
    const acceptedEventNames = acceptedEvents.map(
      (acceptedEvent) => acceptedEvent._def.shape().name._def.value
    );

    const events = await prisma.event.findMany({
      where: { name: { in: acceptedEventNames }, stream },
      orderBy: { createdAt: "asc" },
    });

    return events
      .map((event) => ({ ...event, payload: JSON.parse(event.payload) }))
      .map((event) => {
        const parser = acceptedEvents.find(
          (acceptedEvent) =>
            acceptedEvent._def.shape().name._def.value === event.name
        );

        if (!parser) return undefined;

        return parser.parse(event);
      })
      .filter(
        (event: z.infer<T[0]> | undefined): event is z.infer<T[0]> =>
          event !== undefined
      );
  }

  static async save(event: AcceptedEventType) {
    await prisma.event.create({
      data: { ...event, payload: JSON.stringify(event.payload) },
    });

    Events.emittery.emit(event.name, event);
  }
}
