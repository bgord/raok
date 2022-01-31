import { Reporter } from "@bgord/node";
import execa from "execa";
import path from "path";
import { promises as fs } from "fs";

import * as VO from "../value-objects";
import { ReadableArticleContentGenerator } from "./readable-article-content-generator";
import { ArticleContentDownloader } from "./article-content-downloader";
import { EpubToMobiConverter } from "./epub-to-mobi";

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
      await EpubToMobiConverter.convert(paths.epub, paths.mobi);
    } catch (error) {
      Reporter.raw("NewspaperFile#generate", error);
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

    let result = `
      <title>Newspaper</title>
      <meta name="author" content="RAOK">
      <meta name="description" content="RAOK newspaper">
    `;

    for (const readableArticle of readableArticles) {
      const readingTime = `(${readableArticle.readingTime} min)`;

      result += `<h2 style="margin-top: 100px">${readableArticle.title} ${readingTime}</h2>`;
      result += readableArticle.content;
      result += '<p style="page-break-after: always;">&nbsp;</p>';
    }

    return result;
  }

  static async delete(newspaperId: VO.NewspaperType["id"]) {
    const paths = NewspaperFile.getPaths(newspaperId);

    try {
      await fs.unlink(paths.html);
      await fs.unlink(paths.epub);
      await fs.unlink(paths.mobi);
    } catch (error) {
      Reporter.raw("NewspaperFile#delete", error);
    }
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
