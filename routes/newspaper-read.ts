import express from "express";

export async function NewspaperRead(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  return response.send();
}
