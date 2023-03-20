import z from "zod";
import express from "express";
import * as bg from "@bgord/node";
import { logger } from "./logger";

import * as VO from "./value-objects";
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
        .send({ message: "dashboard.crawling.stopped", _known: true });
    }

    if (error instanceof z.ZodError) {
      if (
        error.issues.find(
          (issue) =>
            issue.message === VO.ARTICLE_SEARCH_QUERY_MIN_LENGTH_ERROR_MESSAGE
        )
      ) {
        return response.status(400).send({
          message: VO.ARTICLE_SEARCH_QUERY_MIN_LENGTH_ERROR_MESSAGE,
          _known: true,
        });
      }

      if (
        error.issues.find(
          (issue) =>
            issue.message === VO.ARTICLE_SEARCH_QUERY_MAX_LENGTH_ERROR_MESSAGE
        )
      ) {
        return response.status(400).send({
          message: VO.ARTICLE_SEARCH_QUERY_MAX_LENGTH_ERROR_MESSAGE,
          _known: true,
        });
      }
    }

    /* eslint-disable no-console */
    console.error(error);

    return next(error);
  };
}
