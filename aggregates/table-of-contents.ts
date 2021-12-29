import { UUID } from "@bgord/node";

import * as Events from "../events";
import * as VO from "../value-objects";

import { EventRepository } from "../repositories/event-repository";

type Content = Pick<VO.ArticleType, "id" | "url">;

export class TableOfContents {
  id = UUID.generate();

  contents: Content[];

  constructor(contents: Content[]) {
    this.contents = contents;
  }

  async scheduleNewspaper() {
    const event = Events.NewspaperScheduledEvent.parse({
      name: Events.NEWSPAPER_SCHEDULED_EVENT,
      version: 1,
      payload: { id: this.id, contents: this.contents },
    });
    await EventRepository.save(event);
  }
}
