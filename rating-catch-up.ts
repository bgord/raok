import * as bg from "@bgord/node";
import format from "date-fns/formatISO";

import * as Newspapers from "./modules/newspapers";
import * as Recommendations from "./modules/recommendations";
import * as infra from "./infra";

export async function main() {
  // ARTICLE_READ_EVENT
  const articleReadEvents = await infra.db.event.findMany({
    where: { name: Newspapers.Events.ARTICLE_READ_EVENT },
  });

  const articleReadStepper = new bg.Stepper({
    total: articleReadEvents.length,
  });

  for (const event of articleReadEvents) {
    const result = Newspapers.Events.ArticleReadEvent.parse({
      ...event,
      payload: JSON.parse(event.payload),
    });

    console.log(
      articleReadStepper.format(),
      Recommendations.Services.RatingActionEnum.read,
      result.payload.articleId
    );

    articleReadStepper.continue();

    await Recommendations.Services.RatingUpdateProcessor.process(
      result.payload.articleId,
      Recommendations.Services.RatingActionEnum.read
    );
  }

  // ARTICLE_OPENED_EVENT
  const articleOpenedEvents = await infra.db.event.findMany({
    where: { name: Newspapers.Events.ARTICLE_OPENED_EVENT },
  });

  const articleOpenedStepper = new bg.Stepper({
    total: articleOpenedEvents.length,
  });

  for (const event of articleOpenedEvents) {
    const result = Newspapers.Events.ArticleOpenedEvent.parse({
      ...event,
      payload: JSON.parse(event.payload),
    });

    console.log(
      articleOpenedStepper.format(),
      Recommendations.Services.RatingActionEnum.opened,
      result.payload.articleId
    );

    articleOpenedStepper.continue();

    await Recommendations.Services.RatingUpdateProcessor.process(
      result.payload.articleId,
      Recommendations.Services.RatingActionEnum.opened
    );
  }

  // ARTICLE_PROCESSED_EVENT
  const articleProcessedEvents = await infra.db.event.findMany({
    where: { name: Newspapers.Events.ARTICLE_PROCESSED_EVENT },
  });

  const articleProcessedStepper = new bg.Stepper({
    total: articleProcessedEvents.length,
  });

  for (const event of articleProcessedEvents) {
    const result = Newspapers.Events.ArticleProcessedEvent.parse({
      ...event,
      payload: JSON.parse(event.payload),
    });

    console.log(
      articleProcessedStepper.format(),
      Recommendations.Services.RatingActionEnum.processed,
      result.payload.articleId
    );

    articleProcessedStepper.continue();

    await Recommendations.Services.RatingUpdateProcessor.process(
      result.payload.articleId,
      Recommendations.Services.RatingActionEnum.processed
    );
  }

  // ARTICLE_DELETED_EVENT
  const articleDeletedEvents = await infra.db.event.findMany({
    where: {
      name: Newspapers.Events.ARTICLE_DELETED_EVENT,
      createdAt: { gte: format(1702823580000) },
    },
  });

  const articleDeletedStepper = new bg.Stepper({
    total: articleDeletedEvents.length,
  });

  for (const event of articleDeletedEvents) {
    const result = Newspapers.Events.ArticleDeletedEvent.parse({
      ...event,
      payload: JSON.parse(event.payload),
    });

    console.log(
      articleDeletedStepper.format(),
      Recommendations.Services.RatingActionEnum.deleted,
      result.payload.articleId
    );

    articleDeletedStepper.continue();

    await Recommendations.Services.RatingUpdateProcessor.process(
      result.payload.articleId,
      Recommendations.Services.RatingActionEnum.deleted
    );
  }
}

main();
