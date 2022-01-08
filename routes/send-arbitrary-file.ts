import express from "express";

export async function SendArbitraryFile(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  console.log(request.files);
  return response.send();
}
