import * as Events from "../events";
import * as VO from "../value-objects";

import { EventRepository } from "../repositories/event-repository";

export class Settings {
  numberOfArticlesToAutosend: VO.NumberOfArticlesToAutosendType =
    VO.NumberOfArticlesToAutosendDefault;

  async build() {
    const events = await EventRepository.find([
      Events.UpdatedNumberOfArticlesToAutosendEvent,
    ]);

    for (const event of events) {
      if (event.name === Events.UPDATED_NUMBER_OF_ARTICLES_TO_AUTOSEND_EVENT) {
        this.numberOfArticlesToAutosend =
          event.payload.numberOfArticlesToAutosend;
      }
    }

    return this;
  }

  async updateNumberOfArticlesToAutosend(
    value: VO.NumberOfArticlesToAutosendType
  ) {
    const event = Events.UpdatedNumberOfArticlesToAutosendEvent.parse({
      name: Events.UPDATED_NUMBER_OF_ARTICLES_TO_AUTOSEND_EVENT,
      version: 1,
      payload: { numberOfArticlesToAutosend: value },
    });
    await EventRepository.save(event);
  }
}
