import * as bg from "@bgord/node";

import * as Services from "./services";
import * as Events from "../newspapers/events";
import { ArticleSourceEnum } from "../newspapers/value-objects/article-source";

import * as infra from "../../infra";

const EventHandler = new bg.EventHandler(infra.logger);

export const onArticleAddedEventHandler =
  EventHandler.handle<Events.ArticleAddedEventType>(async (event) => {
    if (event.payload.source === ArticleSourceEnum.web) {
      await Services.TokenRatingUpdateProcessor.process(
        event.payload.id,
        Services.RatingActionEnum.added
      );
    }
  });

export const onArticleDeletedEventHandler =
  EventHandler.handle<Events.ArticleDeletedEventType>(async (event) => {
    await Services.TokenRatingUpdateProcessor.process(
      event.payload.articleId,
      Services.RatingActionEnum.deleted
    );
  });

export const onArticleReadEventHandler =
  EventHandler.handle<Events.ArticleReadEventType>(async (event) => {
    await Services.TokenRatingUpdateProcessor.process(
      event.payload.articleId,
      Services.RatingActionEnum.read
    );
  });

export const onArticleProcessedEventHandler =
  EventHandler.handle<Events.ArticleProcessedEventType>(async (event) => {
    await Services.TokenRatingUpdateProcessor.process(
      event.payload.articleId,
      Services.RatingActionEnum.processed
    );
  });

export const onArticleOpenedEventHandler =
  EventHandler.handle<Events.ArticleOpenedEventType>(async (event) => {
    await Services.TokenRatingUpdateProcessor.process(
      event.payload.articleId,
      Services.RatingActionEnum.opened
    );
  });
