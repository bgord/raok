import express from "express";
import * as bg from "@bgord/node";
import * as fs from "node:fs/promises";
import path from "node:path";

import * as Repos from "../repositories";
import * as VO from "../value-objects";

/** @public */
export async function DownloadFile(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
) {
  const fileId = VO.FileId.safeParse(request.params.fileId);
  if (!fileId.success) throw new bg.Errors.FileNotFoundError();

  const file = await Repos.FilesRepository.getSingle(fileId.data);
  if (!file) throw new bg.Errors.FileNotFoundError();

  try {
    const filePath = path.resolve(file.path);
    await fs.access(filePath);

    return response.download(filePath, file.name);
  } catch (error) {
    throw new bg.Errors.FileNotFoundError();
  }
}
