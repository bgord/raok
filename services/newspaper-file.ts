import execa from "execa";
import { promises as fs } from "fs";

import * as VO from "../value-objects";

type NewspaperFileCreatorConfigType = {
  newspaperId: VO.NewspaperType["id"];
  readableArticles: VO.ReadableArticleType[];
};

export class NewspaperFile {
  newspaperId: NewspaperFileCreatorConfigType["newspaperId"];
  readableArticles: NewspaperFileCreatorConfigType["readableArticles"];

  constructor(config: NewspaperFileCreatorConfigType) {
    this.newspaperId = config.newspaperId;
    this.readableArticles = config.readableArticles;
  }

  async save() {
    const paths = NewspaperFile.getPaths(this.newspaperId);

    let result = `<h1 style="margin-bottom: 50px">Newspaper</h1>`;

    for (const readableArticle of this.readableArticles) {
      result += `<h2 style="margin-top: 100px">${readableArticle.title}</h2>`;
      result += readableArticle.content;
    }

    await fs.writeFile(paths.html, result);

    try {
      await execa("pandoc", ["-o", paths.epub, paths.html]);
      await execa("ebook-convert", [paths.epub, paths.mobi]);
    } catch (error) {
      /* eslint-disable no-console */
      console.error(error);
    }
  }

  static async delete(newspaperId: VO.NewspaperType["id"]) {
    const path = NewspaperFile.getPaths(newspaperId);
    try {
      await fs.unlink(path.html);
      await fs.unlink(path.epub);
      await fs.unlink(path.mobi);
    } catch (error) {}
  }

  static getPaths(newspaperId: VO.NewspaperType["id"]) {
    return {
      html: `newspapers/${newspaperId}.html`,
      epub: `newspapers/${newspaperId}.epub`,
      mobi: `newspapers/${newspaperId}.mobi`,
    };
  }
}
