import * as bg from "@bgord/node";
import express from "express";

export class AuthShield {
  static verify = bg.Middleware(AuthShield._verify);

  private static async _verify(
    _request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    if (!response.locals.user) {
      throw new bg.Errors.AccessDeniedError({
        reason: bg.Errors.AccessDeniedErrorReasonType.auth,
      });
    }
    return next();
  }
}
