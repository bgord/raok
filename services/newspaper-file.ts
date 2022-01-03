import execa from "execa";
import path from "path";
import { promises as fs } from "fs";

import * as VO from "../value-objects";
import { ReadableArticleContentGenerator } from "./readable-article-content-generator";
import { ArticleContentDownloader } from "./article-content-downloader";

type NewspaperFileCreatorConfigType = {
  newspaperId: VO.NewspaperType["id"];
  articles: VO.NewspaperType["articles"];
};

export class NewspaperFile {
  newspaperId: NewspaperFileCreatorConfigType["newspaperId"];
  articles: NewspaperFileCreatorConfigType["articles"];

  constructor(config: NewspaperFileCreatorConfigType) {
    this.newspaperId = config.newspaperId;
    this.articles = config.articles;
  }

  async create() {
    const paths = NewspaperFile.getPaths(this.newspaperId);

    const content = await this.compose();
    await fs.writeFile(paths.html, content);

    try {
      await execa("pandoc", ["-o", paths.epub, paths.html]);
      await execa("ebook-convert", [paths.epub, paths.mobi]);
    } catch (error) {
      /* eslint-disable no-console */
      console.error(error);
    }
  }

  private async compose() {
    const readableArticles: VO.ReadableArticleType[] = [];

    for (const article of this.articles) {
      const articleContent = await ArticleContentDownloader.download(
        article.url
      );

      if (!articleContent) continue;

      const readableArticle = ReadableArticleContentGenerator.generate({
        content: articleContent,
        url: article.url,
      });

      if (!readableArticle) continue;

      readableArticles.push(readableArticle);
    }

    let result = `<h1 style="margin-bottom: 50px">Newspaper</h1>`;

    for (const readableArticle of readableArticles) {
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
