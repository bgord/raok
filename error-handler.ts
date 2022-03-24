import express from "express";
import { Errors } from "@bgord/node";

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

    if (error instanceof Errors.InvalidCredentialsError) {
      return response.redirect("/");
    }

    if (error instanceof Errors.AccessDeniedError) {
      return response.redirect("/");
    }

    if (error instanceof Policies.NonProcessedArticleUrlIsNotUniqueError) {
      return response
        .status(400)
        .send({ message: "article.error.not_unique", _known: true });
    }

    return next(error);
  };
}
