import { Reporter } from "@bgord/node";
import path from "path";
import { promises as fs } from "fs";

import * as VO from "../value-objects";
import { ReadableArticleContentGenerator } from "./readable-article-content-generator";
import { ArticleContentDownloader } from "./article-content-downloader";

import { HtmlToEpubConverter } from "./html-to-epub";

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

    try {
      const content = await this.compose();
      await fs.writeFile(paths.html, content);

      await HtmlToEpubConverter.convert(paths.html, paths.epub);
    } catch (error) {
      Reporter.raw("NewspaperFile#create", error);
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

  static async clear(newspaperId: VO.NewspaperType["id"]) {
    const paths = NewspaperFile.getPaths(newspaperId);

    try {
      await fs.unlink(paths.epub);
    } catch (error) {
      Reporter.raw("NewspaperFile#delete", error);
    }
  }

  static getPaths(newspaperId: VO.NewspaperType["id"]) {
    const base = path.resolve(__dirname, "../newspapers");

    return {
      html: `${base}/${newspaperId}.html`,
      epub: `${base}/${newspaperId}.epub`,
    };
  }

  static getAttachment(id: VO.NewspaperType["id"]) {
    const { epub } = NewspaperFile.getPaths(id);

    return { path: epub, originalFilename: "newspaper" };
  }

  static async read(id: VO.NewspaperType["id"]): Promise<string | null> {
    const { html } = NewspaperFile.getPaths(id);

    try {
      const file = await fs.readFile(html);
      return file.toString();
    } catch (error) {
      Reporter.raw("NewspaperFile#read", error);
      return null;
    }
  }
}
