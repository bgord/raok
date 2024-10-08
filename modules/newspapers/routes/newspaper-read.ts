import express from "express";

import * as VO from "../value-objects";
import * as Repos from "../repositories";
import * as Services from "../services";

/** @public */
export async function NewspaperRead(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const newspaperId = VO.NewspaperId.parse(request.params.newspaperId);
  const newspaper = await Repos.NewspaperRepository.getById(newspaperId);

  if (!newspaper) {
    response.send("File doesn't exist");
    return;
  }

  const html = await Services.NewspaperFile.read(newspaperId);

  if (!html) {
    response.send("File doesn't exist");
    return;
  }

  response.send(html);
}
