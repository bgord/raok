import express from "express";
import * as bg from "@bgord/node";

export async function Home(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  if (response.locals.user) return response.redirect("/dashboard");

  const vars = {
    ...bg.CsrfShield.extract(request),
  };

  return response.render("home", vars);
}
