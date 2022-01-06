import express from "express";

import * as VO from "../value-objects";
import { Newspaper } from "../aggregates/newspaper";

export async function ResendNewspaper(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const newspaperId = VO.NewspaperId.parse(request.params.newspaperId);

  const newspaper = await new Newspaper(newspaperId).build();
  await newspaper.resend();

  return response.send();
}
