import express from "express";
import * as bg from "@bgord/node";

import * as Policies from "./policies";

export class ErrorHandler {
  /* eslint-disable max-params */
  static handle: express.ErrorRequestHandler = async (
    error,
    _request,
    response,
    next
  ) => {
    /* eslint-disable no-console */
    console.error(error);

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
      return response
        .status(400)
        .send({ message: "article.error.not_unique", _known: true });
    }

    if (error instanceof Policies.ShouldCrawlFeedlyError) {
      return response
        .status(400)
        .send({ message: "crawling.stopped", _known: true });
    }

    return next(error);
  };
}
