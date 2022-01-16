import express from "express";

export async function Settings(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const vars = {
    username: request.user as string,
  };

  return response.render("settings", vars);
}
