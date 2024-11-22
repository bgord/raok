import * as bg from "@bgord/node";
import _ from "lodash";
import path from "node:path";
import { promises as fs } from "node:fs";
import crypto from "node:crypto";

import * as infra from "../../../infra";

import * as VO from "../value-objects";

import { ReadableArticleGenerator } from "./readable-article-generator";
import { ArticleContentDownloader } from "./article-content-downloader";
import { HtmlToEpubConverter } from "./html-to-epub";

type NewspaperFileCreatorConfigType = {
  newspaperId: VO.NewspaperType["id"];
  articles: VO.NewspaperType["articles"];
};

export type NewspaperFilePaths = {
  html: bg.Schema.PathType;
  epub: bg.Schema.PathType;
  mobi: bg.Schema.PathType;
};

export class NewspaperFile {
  newspaperId: NewspaperFileCreatorConfigType["newspaperId"];

  articles: NewspaperFileCreatorConfigType["articles"];

  emptyLine = '<p style="page-break-after: always;">&nbsp;</p>';

  constructor(config: NewspaperFileCreatorConfigType) {
    this.newspaperId = config.newspaperId;
    this.articles = config.articles;
  }

  async create() {
    const paths = NewspaperFile.getPaths(this.newspaperId);

    try {
      const content = await this.compose();
      await fs.writeFile(paths.html, content);

      await HtmlToEpubConverter.convert(paths);
    } catch (error) {
      infra.logger.error({
        message: "NewspaperFile create error",
        operation: "newspaper_file",
        metadata: infra.logger.formatError(error),
      });
    }
  }

  private async compose() {
    const readableArticles: VO.ReadableArticleType[] = [];

    for (const article of this.articles) {
      const articleContent = await ArticleContentDownloader.download(
        article.url
      );

      if (!articleContent) continue;

      const readableArticle = ReadableArticleGenerator.generate({
        content: articleContent,
        url: article.url,
      });

      if (!readableArticle) continue;

      readableArticles.push(readableArticle);
    }

    const totalReadingTime = readableArticles
      .map((article) => article.readingTime ?? 0)
      .reduce(_.add, 0);

    let result = `
      <title>Newspaper</title>
      <meta name="author" content="RAOK">
      <meta name="description" content="RAOK newspaper">

      <div>Total reading time: ${totalReadingTime} min</div>
    `;

    result += "<h1>Table of content</h2>";
    result += "<ul>";

    for (const readableArticle of readableArticles) {
      const readingTime = `(${readableArticle.readingTime} min)`;

      const hash = crypto
        .createHash("sha256")
        .update(readableArticle.title)
        .digest("hex");

      result += `<li style="margin-bottom: 25px"><a href="#${hash}">${readableArticle.title} ${readingTime}</a></li>`;
    }

    result += "</ul>";
    result += this.emptyLine;

    for (const readableArticle of readableArticles) {
      const readingTime = `(${readableArticle.readingTime} min)`;

      const hash = crypto
        .createHash("sha256")
        .update(readableArticle.title)
        .digest("hex");

      result += `<h2 id="${hash}" style="margin-top: 100px">${readableArticle.title} ${readingTime}</h2>`;
      result += readableArticle.content;
      result += this.emptyLine;
    }

    return result;
  }

  static async clear(newspaperId: VO.NewspaperType["id"]) {
    const paths = NewspaperFile.getPaths(newspaperId);

    try {
      await fs.unlink(paths.epub);
      await fs.unlink(paths.mobi);
    } catch (error) {
      infra.logger.error({
        message: "NewspaperFile clear error",
        operation: "newspaper_file",
        metadata: infra.logger.formatError(error),
      });
    }
  }

  static getPaths(newspaperId: VO.NewspaperType["id"]): NewspaperFilePaths {
    return {
      html: bg.Schema.Path.parse(`newspapers/${newspaperId}.html`),
      epub: bg.Schema.Path.parse(`newspapers/${newspaperId}.epub`),
      mobi: bg.Schema.Path.parse(`newspapers/${newspaperId}.mobi`),
    };
  }

  static getAttachment(id: VO.NewspaperType["id"]) {
    const { epub } = NewspaperFile.getPaths(id);

    return {
      path: bg.Schema.Path.parse(epub),
      originalFilename: bg.Schema.UploadedFile._def
        .shape()
        .originalFilename.parse(path.basename(epub)),
    };
  }
}
