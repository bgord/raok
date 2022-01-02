import execa from "execa";
import path from "path";
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

    const content = this.compose();
    await fs.writeFile(paths.html, content);

    try {
      await execa("pandoc", ["-o", paths.epub, paths.html]);
      await execa("ebook-convert", [paths.epub, paths.mobi]);
    } catch (error) {
      /* eslint-disable no-console */
      console.error(error);
    }
  }

  private compose() {
    let result = `<h1 style="margin-bottom: 50px">Newspaper</h1>`;

    for (const readableArticle of this.readableArticles) {
      result += `<h2 style="margin-top: 100px">${readableArticle.title}</h2>`;
      result += readableArticle.content;
    }

    return result;
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
    const base = path.resolve(__dirname, "../newspapers");

    return {
      html: `${base}/${newspaperId}.html`,
      epub: `${base}/${newspaperId}.epub`,
      mobi: `${base}/${newspaperId}.mobi`,
    };
  }
}
