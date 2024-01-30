import * as bg from "@bgord/node";
import express from "express";

import * as infra from "../infra";

export class SessionId {
  private value: string | null;

  constructor(cookie: string | undefined) {
    this.value = infra.lucia.readSessionCookie(cookie ?? "");
  }

  get(): SessionId["value"] {
    return this.value;
  }
}

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
    const sessionId = new SessionId(request.headers.cookie).get();

    if (!sessionId) return next();

    await infra.lucia.invalidateSession(sessionId);
    return next();
  }

  static applyTo(app: express.Application): void {
    app.use(bg.Middleware(AuthShield._applyTo));
  }

  private static async _applyTo(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const sessionId = new SessionId(request.headers.cookie).get();

    if (!sessionId) {
      response.locals.user = null;
      response.locals.session = null;
      return next();
    }

    const { session, user } = await infra.lucia.validateSession(sessionId);

    if (!session) {
      response.appendHeader(
        "Set-Cookie",
        infra.lucia.createBlankSessionCookie().serialize()
      );
      response.locals.user = null;
      response.locals.session = null;
      return next();
    }

    if (session.fresh) {
      response.appendHeader(
        "Set-Cookie",
        infra.lucia.createSessionCookie(session.id).serialize()
      );
    }
    response.locals.user = user;
    response.locals.session = session;
    return next();
  }
}
