import execa from "execa";
import fs from "fs/promises";

import { NewspaperFilePaths } from "./newspaper-file";

export class HtmlToEpubConverter {
  static async convert(paths: NewspaperFilePaths) {
    await execa("pandoc", ["-o", paths.epub, paths.html]);

    // Converting epub -> mobi, and mobi -> epub
    // to avoid epub getting rejected from Amazon issue
    // Source: https://manual.calibre-ebook.com/faq.html#amazon-is-stopping-email-delivery-of-mobi-files
    await execa("ebook-convert", [paths.epub, paths.mobi]);
    await fs.unlink(paths.epub);
    await execa("ebook-convert", [paths.mobi, paths.epub]);
  }
}
