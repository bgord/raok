import z from "zod";
import express from "express";
import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as Policies from "../policies";
import * as infra from "../infra";

export class ErrorHandler {
  /* eslint-disable max-params */
  static handle: express.ErrorRequestHandler = async (
    error,
    request,
    response,
    next
  ) => {
    if (error instanceof bg.Errors.InvalidCredentialsError) {
      infra.logger.error({
        message: "Invalid credentials",
        operation: "invalid_credentials_error",
        correlationId: request.requestId,
      });
      return response.redirect("/");
    }

    if (error instanceof bg.Errors.AccessDeniedError) {
      infra.logger.error({
        message: "Access denied",
        operation: "access_denied_error",
        correlationId: request.requestId,
      });
      return response.redirect("/");
    }

    if (error instanceof bg.Errors.FileNotFoundError) {
      infra.logger.error({
        message: "File not found",
        operation: "file_not_found_error",
        correlationId: request.requestId,
      });

      return response.status(404).send("File not found");
    }

    if (error instanceof bg.Errors.TooManyRequestsError) {
      infra.logger.error({
        message: "Too many requests",
        operation: "too_many_requests",
        correlationId: request.requestId,
        metadata: { remainingMs: error.remainingMs },
      });

      return response
        .status(429)
        .send({ message: "app.too_many_requests", _known: true });
    }

    if (error instanceof Policies.NonProcessedArticleUrlIsNotUniqueError) {
      infra.logger.error({
        message: "Article URL is not unique",
        operation: "non_processed_article_url_is_not_unique_error",
        correlationId: request.requestId,
        metadata: request.body,
      });

      return response
        .status(400)
        .send({ message: "article.error.not_unique", _known: true });
    }

    if (error instanceof Policies.ShouldCrawlFeedlyError) {
      infra.logger.error({
        message: "Feedly crawling stopped in the settings",
        operation: "should_crawl_feedly_error",
        correlationId: request.requestId,
      });

      return response
        .status(400)
        .send({ message: "dashboard.crawling.stopped", _known: true });
    }

    if (error instanceof Policies.TooManyArticlesInNewspaperError) {
      infra.logger.error({
        message: "Newspaper with too many articles attempted",
        operation: "too_many_articles_in_newspaper_error",
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: "newspaper.too_many_articles_in_newspaper_error",
        _known: true,
      });
    }

    if (error instanceof Policies.NotificationHourShouldChangeError) {
      infra.logger.error({
        message: "article to review notification hour not changed error",
        operation: "article_to_review_notification_hour_not_changed_error",
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: "articles-to-review-notification.hour.change.error",
        _known: true,
      });
    }

    if (error instanceof VO.ArticleNotFoundError) {
      infra.logger.error({
        message: "Article not found during metatags scrapping",
        operation: "article_not_found_during_metatags_scrapping_error",
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: "article.not_found_during_metatags_scrapping_error",
        _known: true,
      });
    }

    if (error instanceof VO.ArticleIsNotHTML) {
      infra.logger.error({
        message: "Article has incorrect format",
        operation: "article_is_not_html_error",
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: "article.is_not_html_error",
        _known: true,
      });
    }

    if (error instanceof VO.ArticleScrapingTimeoutError) {
      infra.logger.error({
        message: "Article scraping timeout error",
        operation: "article_scraping_timeout_error",
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: "article.scraping_timeout_error",
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

    infra.logger.error({
      message: "Unknown error",
      operation: "unknown_error",
      correlationId: request.requestId,
      metadata: infra.logger.formatError(error),
    });

    return next(error);
  };
}
