import express from "express";
import { CsrfShield } from "@bgord/node";

export async function Home(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  if (request.isAuthenticated()) return response.redirect("/dashboard");

  const vars = {
    ...CsrfShield.extract(request),
  };

  return response.render("home", vars);
}
