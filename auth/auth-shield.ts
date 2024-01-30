import * as bg from "@bgord/node";
import express from "express";

import * as infra from "../infra";

export class AuthShield {
  static verify = bg.Middleware(AuthShield._verify);
  static detach = bg.Middleware(AuthShield._detach);

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

  private static async _detach(
    request: express.Request,
    _response: express.Response,
    next: express.NextFunction
  ) {
    const sessionId = infra.lucia.readSessionCookie(
      request.headers.cookie ?? ""
    );

    if (!sessionId) return next();

    await infra.lucia.invalidateSession(sessionId);

    return next();
  }
}
