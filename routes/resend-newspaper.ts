import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";

export async function ResendNewspaper(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const newspaperId = VO.NewspaperId.parse(request.params.newspaperId);

  const newspaper = await new Aggregates.Newspaper(newspaperId).build();
  await newspaper.resend();

  return response.send();
}
