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
      logger.error({
        message: "Invalid credentials",
        operation: "invalid_credentials_error",
        requestId: request.requestId,
      });
      return response.redirect("/");
    }

    if (error instanceof bg.Errors.AccessDeniedError) {
      logger.error({
        message: "Access denied",
        operation: "access_denied_error",
        requestId: request.requestId,
      });
      return response.redirect("/");
    }

    if (error instanceof bg.Errors.FileNotFoundError) {
      logger.error({
        message: "File not found",
        operation: "file_not_found_error",
        requestId: request.requestId,
      });

      return response.status(404).send("File not found");
    }

    if (error instanceof Policies.NonProcessedArticleUrlIsNotUniqueError) {
      logger.error({
        message: "Article URL is not unique",
        operation: "non_processed_article_url_is_not_unique_error",
        requestId: request.requestId,
        metadata: request.body,
      });

      return response
        .status(400)
        .send({ message: "article.error.not_unique", _known: true });
    }

    if (error instanceof Policies.ShouldCrawlFeedlyError) {
      logger.error({
        message: "Feedly crawling stopped in the settings",
        operation: "should_crawl_feedly_error",
        requestId: request.requestId,
      });

      return response
        .status(400)
        .send({ message: "dashboard.crawling.stopped", _known: true });
    }

    if (error instanceof Policies.TooManyArticlesInNewspaperError) {
      logger.error({
        message: "Newspaper with too many articles attempted",
        operation: "too_many_articles_in_newspaper_error",
        requestId: request.requestId,
      });

      return response.status(400).send({
        message: "newspaper.too_many_articles_in_newspaper_error",
        _known: true,
      });
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

    logger.error({
      message: "Unknown error",
      operation: "unknown_error",
      requestId: request.requestId,
      metadata: {
        message: (error as Error)?.message,
        name: (error as Error)?.name,
        stack: (error as Error)?.stack,
      },
    });

    return next(error);
  };
}
