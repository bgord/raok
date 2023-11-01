import express from "express";
import * as bg from "@bgord/node";

export async function Home(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  if (request.isAuthenticated()) return response.redirect("/dashboard");

  const vars = {
    ...bg.CsrfShield.extract(request),
  };

  return response.render("home", vars);
}
