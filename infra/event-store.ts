import * as bg from "@bgord/node";
import { z } from "zod";

import * as Newspapers from "../modules/newspapers";

import * as infra from "../infra";
import * as Events from "../app/events";

type AcceptedEvent =
  | typeof Newspapers.Events.ArticleAddedEvent
  | typeof Newspapers.Events.ArticleDeletedEvent
  | typeof Newspapers.Events.ArticleLockedEvent
  | typeof Newspapers.Events.ArticleProcessedEvent
  | typeof Newspapers.Events.ArticleReadEvent
  | typeof Newspapers.Events.ArticleUndeleteEvent
  | typeof Newspapers.Events.ArticleUnlockedEvent
  | typeof Newspapers.Events.ArticleOpenedEvent
  | typeof Newspapers.Events.ArticleHomepageOpenedEvent
  | typeof Newspapers.Events.NewspaperArchivedEvent
  | typeof Newspapers.Events.NewspaperFailedEvent
  | typeof Newspapers.Events.NewspaperGenerateEvent
  | typeof Newspapers.Events.NewspaperScheduledEvent
  | typeof Newspapers.Events.NewspaperSentEvent;
type AcceptedEventType = z.infer<AcceptedEvent>;

export class EventStore {
  static async find<T extends AcceptedEvent[]>(
    acceptedEvents: T,
    stream?: bg.EventType["stream"]
  ): Promise<z.infer<T[number]>[]> {
    const acceptedEventNames = acceptedEvents.map(
      (acceptedEvent) => acceptedEvent._def.shape().name._def.value
    );

    const events = await infra.db.event.findMany({
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
        (event: z.infer<T[number]> | undefined): event is z.infer<T[number]> =>
          event !== undefined
      );
  }

  static async save(event: AcceptedEventType) {
    await infra.db.event.create({
      data: { ...event, payload: JSON.stringify(event.payload) },
    });

    Events.emittery.emit(event.name, event);
  }
}
