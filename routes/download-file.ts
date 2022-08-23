import express from "express";
import * as bg from "@bgord/node";
import * as fs from "fs/promises";
import path from "path";

import * as Repos from "../repositories";

export async function DownloadFile(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const fileId = bg.Schema.UUID.safeParse(request.params.fileId);
  if (!fileId.success) throw new bg.Errors.FileNotFoundError();

  const file = await Repos.FilesRepository.getSingle(fileId.data);
  if (!file) throw new bg.Errors.FileNotFoundError();

  try {
    const content = await fs.readFile(path.resolve(file.path));

    return response.download(content.toString());
  } catch (error) {
    throw new bg.Errors.FileNotFoundError();
  }
}
