import express from "express";

import * as infra from "../../infra";

export async function Home(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  if (response.locals.user) {
    response.redirect("/dashboard");
    return;
  }

  const vars = { HCAPTCHA_SITE_KEY: infra.Env.HCAPTCHA_SITE_KEY };

  response.render("home", vars);
}
