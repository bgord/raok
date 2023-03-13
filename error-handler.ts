import express from "express";
import * as bg from "@bgord/node";
import { logger } from "./logger";

import * as Policies from "./policies";

export class ErrorHandler {
  /* eslint-disable max-params */
  static handle: express.ErrorRequestHandler = async (
    error,
    request,
    response,
    next
  ) => {
    if (error instanceof bg.Errors.InvalidCredentialsError) {
      return response.redirect("/");
    }

    if (error instanceof bg.Errors.AccessDeniedError) {
      return response.redirect("/");
    }

    if (error instanceof bg.Errors.FileNotFoundError) {
      return response.status(404).send("File not found");
    }

    if (error instanceof Policies.NonProcessedArticleUrlIsNotUniqueError) {
      logger.error({
        message: "Article URL is not unique",
        operation: "error_handler",
        requestId: request.requestId,
      });

      return response
        .status(400)
        .send({ message: "article.error.not_unique", _known: true });
    }

    if (error instanceof Policies.ShouldCrawlFeedlyError) {
      return response
        .status(400)
        .send({ message: "crawling.stopped", _known: true });
    }

    /* eslint-disable no-console */
    console.error(error);

    return next(error);
  };
}
