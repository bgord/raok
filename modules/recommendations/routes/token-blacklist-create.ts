import express from "express";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

export async function TokenBlacklistCreate(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const token = VO.Token.parse(request.body.token);

  await Repos.TokenBlacklistRepository.create({ token });

  return response.status(201).send();
}
