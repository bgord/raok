import * as VO from "./value-objects";
import * as Events from "./events";
import { EventRepository } from "./repositories/event-repository";
import { StatsRepository } from "./repositories/stats-repository";

async function main() {
  const events = await EventRepository.find([
    Events.ArticleAddedEvent,
    Events.NewspaperSentEvent,
  ]);

  for (const event of events) {
    if (event.name === Events.ARTICLE_ADDED_EVENT) {
      await StatsRepository.kv_incrementCreatedArticles();

      if (event.payload.source === VO.ArticleSourceEnum.feedly) {
        await StatsRepository.kv_updateLastFeedlyImport(
          event.payload.createdAt
        );
      }
    }

    if (event.name === Events.NEWSPAPER_SENT_EVENT) {
      await StatsRepository.kv_incrementSentNewspapers();
    }
  }
}

main();
