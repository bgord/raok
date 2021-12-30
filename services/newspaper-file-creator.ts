import * as VO from "../value-objects";
import { promises as fs } from "fs";

type NewspaperFileCreatorConfigType = {
  newspaperId: VO.NewspaperType["id"];
  readableArticles: VO.ReadableArticleType[];
};

export class NewspaperFileCreator {
  newspaperId: NewspaperFileCreatorConfigType["newspaperId"];
  readableArticles: NewspaperFileCreatorConfigType["readableArticles"];

  constructor(config: NewspaperFileCreatorConfigType) {
    this.newspaperId = config.newspaperId;
    this.readableArticles = config.readableArticles;
  }

  async save() {
    const path = NewspaperFileCreator.getPath(this.newspaperId);

    let result = `<h1 style="margin-bottom: 50px">Newspaper</h1>`;

    for (const readableArticle of this.readableArticles) {
      result += `<h2 style="margin-top: 100px">${readableArticle.title}</h2>`;
      result += readableArticle.content;
    }

    await fs.writeFile(path, result);
  }

  static getPath(newspaperId: VO.NewspaperType["id"]) {
    return `newspapers/${newspaperId}.html`;
  }
}
