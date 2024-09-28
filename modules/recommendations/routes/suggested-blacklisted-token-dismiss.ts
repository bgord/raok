import * as bg from "@bgord/node";
import express from "express";

import * as VO from "../value-objects";
import * as Services from "../services";

export async function SuggestedBlacklistedTokenDismiss(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
) {
  const token = VO.Token.parse(request.body.token);

  const suggestedBlacklistedToken =
    await Services.SuggestedBlacklistedToken.build(token);

  const until = bg.Time.Now().Add(bg.Time.Days(30)).ms;

  await suggestedBlacklistedToken.dismiss(until);

  response.status(200).send();
}
