import * as bg from "@bgord/node";

import * as Services from "./services";
import * as Events from "../newspapers/events";

import * as infra from "../../infra";

const EventHandler = new bg.EventHandler(infra.logger);

export const onArticleDeletedEventHandler =
  EventHandler.handle<Events.ArticleDeletedEventType>(async (event) => {
    await Services.RatingUpdateProcessor.process(
      event.payload.articleId,
      Services.RatingActionEnum.deleted
    );
  });

export const onArticleReadEventHandler =
  EventHandler.handle<Events.ArticleReadEventType>(async (event) => {
    await Services.RatingUpdateProcessor.process(
      event.payload.articleId,
      Services.RatingActionEnum.read
    );
  });

export const onArticleProcessedEventHandler =
  EventHandler.handle<Events.ArticleProcessedEventType>(async (event) => {
    await Services.RatingUpdateProcessor.process(
      event.payload.articleId,
      Services.RatingActionEnum.processed
    );
  });

export const onArticleOpenedEventHandler =
  EventHandler.handle<Events.ArticleOpenedEventType>(async (event) => {
    await Services.RatingUpdateProcessor.process(
      event.payload.articleId,
      Services.RatingActionEnum.opened
    );
  });
