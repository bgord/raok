import * as bg from "@bgord/node";

import * as Services from "./services";
import * as Events from "../newspapers/events";
import * as Repos from "./repositories";
import { ArticleRepository } from "../newspapers/repositories/article-repository";

import * as infra from "../../infra";

const EventHandler = new bg.EventHandler(infra.logger);

export const onArticleDeletedEventHandler =
  EventHandler.handle<Events.ArticleDeletedEventType>(async (event) => {
    const article = await ArticleRepository.getSingle(event.payload.articleId);

    if (!article?.title) return;

    const tokenRatings = Services.TokenRatingCalculator.calculate(
      Services.RatingActionEnum.deleted,
      Services.Tokenizer.tokenize(article.title)
    );

    for (const tokenRating of tokenRatings) {
      await Repos.TokenRatingRepository.upsert(tokenRating);
    }
  });

export const onArticleReadEventHandler =
  EventHandler.handle<Events.ArticleReadEventType>(async (event) => {
    const article = await ArticleRepository.getSingle(event.payload.articleId);

    if (!article?.title) return;

    const tokenRatings = Services.TokenRatingCalculator.calculate(
      Services.RatingActionEnum.read,
      Services.Tokenizer.tokenize(article.title)
    );

    for (const tokenRating of tokenRatings) {
      await Repos.TokenRatingRepository.upsert(tokenRating);
    }
  });

export const onArticleProcessedEventHandler =
  EventHandler.handle<Events.ArticleProcessedEventType>(async (event) => {
    const article = await ArticleRepository.getSingle(event.payload.articleId);

    if (!article?.title) return;

    const tokenRatings = Services.TokenRatingCalculator.calculate(
      Services.RatingActionEnum.processed,
      Services.Tokenizer.tokenize(article.title)
    );

    for (const tokenRating of tokenRatings) {
      await Repos.TokenRatingRepository.upsert(tokenRating);
    }
  });

export const onArticleOpenedEventHandler =
  EventHandler.handle<Events.ArticleOpenedEventType>(async (event) => {
    const article = await ArticleRepository.getSingle(event.payload.articleId);

    if (!article?.title) return;

    const tokenRatings = Services.TokenRatingCalculator.calculate(
      Services.RatingActionEnum.opened,
      Services.Tokenizer.tokenize(article.title)
    );

    for (const tokenRating of tokenRatings) {
      await Repos.TokenRatingRepository.upsert(tokenRating);
    }
  });
