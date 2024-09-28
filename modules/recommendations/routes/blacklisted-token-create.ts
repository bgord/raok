import express from "express";

import * as VO from "../value-objects";
import * as Repos from "../repositories";
import * as Policies from "../policies";

export async function BlacklistedTokenCreate(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const token = VO.Token.parse(request.body.token);

  await Policies.BlacklistedTokenIsUnique.perform({ token });
  await Repos.TokenBlacklistRepository.create({ token });

  response.status(201).send();
}
