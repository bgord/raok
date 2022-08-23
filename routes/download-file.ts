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
  if (!fileId.success) return response.status(404).send("File doesn't exist");

  const file = await Repos.FilesRepository.getSingle(fileId.data);
  if (!file) return response.status(404).send("File doesn't exist");

  try {
    const content = await fs.readFile(path.resolve(file.path));

    return response.download(content.toString());
  } catch (error) {
    return response.status(404).send("File doesn't exist");
  }
}
