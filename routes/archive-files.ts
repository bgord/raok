import express from "express";

import * as Repos from "../repositories";

export async function ArchiveFiles() {
  return Repos.FilesRepository.getAll();
}
