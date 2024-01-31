import express from "express";

export async function Home(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
): Promise<void> {
  if (response.locals.user) return response.redirect("/dashboard");

  return response.render("home");
}
