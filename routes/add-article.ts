import express from "express";

import { Articles } from "../aggregates/articles";

export async function AddArticle(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  await Articles.addArticle({ url: request.body.url });

  return response.redirect("/dashboard");
}
