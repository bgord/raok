import * as bg from "@bgord/node";
import express from "express";
import { Lucia } from "lucia";

import {
  Password,
  HashedPassword,
  Username,
  PasswordType,
  IdType,
} from "./password";

export class SessionId {
  private value: string | null;

  constructor(cookie: string | undefined, lucia: Lucia) {
    this.value = lucia.readSessionCookie(cookie ?? "");
  }

  get(): SessionId["value"] {
    return this.value;
  }
}

export type AuthShieldConfigType<T> = {
  Username: typeof Username;
  Password: typeof Password;
  HashedPassword: typeof HashedPassword;
  lucia: Lucia;
  findUniqueUserOrThrow: (username: Username) => Promise<T>;
};

export class AuthShield<T extends { password: PasswordType; id: IdType }> {
  constructor(private readonly config: AuthShieldConfigType<T>) {}

  private async _verify(
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

  private async _reverse(
    _request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    if (response.locals.user) {
      throw new bg.Errors.AccessDeniedError({
        reason: bg.Errors.AccessDeniedErrorReasonType.auth,
      });
    }
    return next();
  }

  private async _detach(
    request: express.Request,
    _response: express.Response,
    next: express.NextFunction
  ) {
    const sessionId = new SessionId(
      request.headers.cookie,
      this.config.lucia
    ).get();

    if (!sessionId) return next();

    await this.config.lucia.invalidateSession(sessionId);
    return next();
  }

  applyTo(app: express.Application): void {
    app.use(bg.Middleware(this._applyTo.bind(this)));
  }

  private async _applyTo(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const sessionId = new SessionId(
      request.headers.cookie,
      this.config.lucia
    ).get();

    if (!sessionId) {
      response.locals.user = null;
      response.locals.session = null;
      return next();
    }

    const { session, user } = await this.config.lucia.validateSession(
      sessionId
    );

    if (!session) {
      response.appendHeader(
        "Set-Cookie",
        this.config.lucia.createBlankSessionCookie().serialize()
      );
      response.locals.user = null;
      response.locals.session = null;
      return next();
    }

    if (session.fresh) {
      response.appendHeader(
        "Set-Cookie",
        this.config.lucia.createSessionCookie(session.id).serialize()
      );
    }
    response.locals.user = user;
    response.locals.session = session;
    return next();
  }

  private async _attach(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      const username = new this.config.Username(request.body.username);
      const password = new this.config.Password(request.body.password);

      const user = await this.config.findUniqueUserOrThrow(username);

      const hashedPassword = await this.config.HashedPassword.fromHash(
        user.password
      );
      await hashedPassword.matchesOrThrow(password);

      const session = await this.config.lucia.createSession(user.id, {});
      const sessionCookie = this.config.lucia.createSessionCookie(session.id);

      response.appendHeader("Set-Cookie", sessionCookie.serialize());
      return next();
    } catch (error) {
      throw new bg.Errors.AccessDeniedError({
        reason: bg.Errors.AccessDeniedErrorReasonType.auth,
      });
    }
  }

  verify = bg.Middleware(this._verify.bind(this));
  reverse = bg.Middleware(this._reverse.bind(this));
  detach = bg.Middleware(this._detach.bind(this));
  attach = bg.Middleware(this._attach.bind(this));
}
