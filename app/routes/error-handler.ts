import z from "zod";
import express from "express";
import * as bg from "@bgord/node";

import * as RSS from "../../modules/rss";
import * as Newspapers from "../../modules/newspapers";
import * as Recommendations from "../../modules/recommendations";

import * as infra from "../../infra";

export class ErrorHandler {
  static handle: express.ErrorRequestHandler = async (
    error,
    request,
    response,
    next,
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
        metadata: { reason: error.reason, message: error.message },
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

    if (error instanceof bg.Errors.InvalidRevisionError) {
      infra.logger.error({
        message: "Invalid revision",
        operation: "revision_invalid_error",
        correlationId: request.requestId,
        metadata: { url: request.url },
      });

      return response
        .status(400)
        .send({ message: "revision.invalid.error", _known: true });
    }

    if (error instanceof bg.Errors.RevisionMismatchError) {
      infra.logger.error({
        message: "Revision mismatch",
        operation: "revision_mismatch_error",
        correlationId: request.requestId,
        metadata: { url: request.url },
      });

      return response
        .status(412)
        .send({ message: "revision.mismatch.error", _known: true });
    }

    if (
      error instanceof
      Newspapers.Policies.NonProcessedArticleUrlIsNotUniqueError
    ) {
      infra.logger.error({
        message: "Article URL is not unique",
        operation: Newspapers.Policies.NonProcessedArticleUrlIsUnique.message,
        correlationId: request.requestId,
        metadata: request.body,
      });

      return response.status(400).send({
        message: Newspapers.Policies.NonProcessedArticleUrlIsUnique.message,
        _known: true,
      });
    }

    if (error instanceof Newspapers.Policies.TooManyArticlesInNewspaperError) {
      infra.logger.error({
        message: "Newspaper with too many articles attempted",
        operation: Newspapers.Policies.MaximumNewspaperArticleNumber.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Newspapers.Policies.MaximumNewspaperArticleNumber.message,
        _known: true,
      });
    }

    if (error instanceof Newspapers.VO.ArticleNotFoundError) {
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

    if (error instanceof Newspapers.VO.ArticleIsNotHTML) {
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

    if (error instanceof Newspapers.VO.ArticleScrapingTimeoutError) {
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

    if (error instanceof RSS.Policies.SourceUrlIsNotUniqueError) {
      infra.logger.error({
        message: "Source is not unique",
        operation: RSS.Policies.SourceUrlIsUnique.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: RSS.Policies.SourceUrlIsUnique.message,
        _known: true,
      });
    }

    if (error instanceof RSS.Policies.SourceUrlRespondsError) {
      infra.logger.error({
        message: "Source does not respond",
        operation: RSS.Policies.SourceUrlResponds.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: RSS.Policies.SourceUrlResponds.message,
        _known: true,
      });
    }

    if (
      error instanceof Recommendations.Policies.BlacklistedTokenIsNotUniqueError
    ) {
      infra.logger.error({
        message: "Blacklisted token is not unique",
        operation: Recommendations.Policies.BlacklistedTokenIsUnique.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Recommendations.Policies.BlacklistedTokenIsUnique.message,
        _known: true,
      });
    }

    if (error instanceof Newspapers.Policies.ArticleBlacklistedError) {
      infra.logger.error({
        message: "Article title blacklisted",
        operation: Newspapers.Policies.ArticleTitleNotBlacklisted.message,
        correlationId: request.requestId,
      });

      return response.status(400).send({
        message: Newspapers.Policies.ArticleTitleNotBlacklisted.message,
        _known: true,
      });
    }

    if (error instanceof z.ZodError) {
      if (
        error.issues.find(
          (issue) =>
            issue.message ===
            Newspapers.VO.ARTICLE_SEARCH_QUERY_MIN_LENGTH_ERROR_MESSAGE,
        )
      ) {
        return response.status(400).send({
          message: Newspapers.VO.ARTICLE_SEARCH_QUERY_MIN_LENGTH_ERROR_MESSAGE,
          _known: true,
        });
      }

      if (
        error.issues.find(
          (issue) =>
            issue.message ===
            Newspapers.VO.ARTICLE_SEARCH_QUERY_MAX_LENGTH_ERROR_MESSAGE,
        )
      ) {
        return response.status(400).send({
          message: Newspapers.VO.ARTICLE_SEARCH_QUERY_MAX_LENGTH_ERROR_MESSAGE,
          _known: true,
        });
      }

      if (
        error.issues.find(
          (issue) =>
            issue.message === Recommendations.VO.TOKEN_STRUCTURE_ERROR_KEY,
        )
      ) {
        return response.status(400).send({
          message: Recommendations.VO.TOKEN_STRUCTURE_ERROR_KEY,
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
