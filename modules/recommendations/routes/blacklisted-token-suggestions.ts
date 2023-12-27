import * as bg from "@bgord/node";
import express from "express";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

import * as infra from "../../../infra";

export async function BlacklistedTokenSuggestions(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const suggestions =
    await Repos.TokenBlacklistRepository.getSuggestedBlacklistedTokens(
      VO.SUGGESTED_BLACKLISTED_TOKENS_COUNT
    );

  infra.ResponseCache.set(
    request.url,
    suggestions,
    bg.Time.Minutes(30).seconds
  );
  return response.status(200).send(suggestions);
}
