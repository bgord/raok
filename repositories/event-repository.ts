import { z } from "zod";
import { PrismaClient } from "@prisma/client";

import * as Events from "../events";

const prisma = new PrismaClient();

type AcceptedEvent =
  | typeof Events.ArticleAddedEvent
  | typeof Events.ArticleDeletedEvent
  | typeof Events.ArticleLockedEvent
  | typeof Events.ArticleProcessedEvent
  | typeof Events.ArticleAddedToFavouritesEvent
  | typeof Events.ArticleDeletedFromFavouritesEvent
  | typeof Events.NewspaperArchivedEvent
  | typeof Events.NewspaperFailedEvent
  | typeof Events.NewspaperGenerateEvent
  | typeof Events.NewspaperScheduledEvent
  | typeof Events.NewspaperSentEvent;
type AcceptedEventType = z.infer<AcceptedEvent>;

export class EventRepository {
  static async find<T extends AcceptedEvent[]>(
    acceptedEvents: T,
    stream?: Events.StreamType
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
