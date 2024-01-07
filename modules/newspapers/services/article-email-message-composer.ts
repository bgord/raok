import * as VO from "../value-objects";

import { ArticleContentDownloader } from "./article-content-downloader";
import { ReadableArticleGenerator } from "./readable-article-generator";

export class ArticleEmailMessageComposer {
  static async compose(url: VO.ArticleUrlType) {
    const articleContent = await ArticleContentDownloader.download(url);

    const readableArticle = ReadableArticleGenerator.generate({
      content: articleContent as VO.ArticleContentType,
      url,
    });

    return {
      html: readableArticle?.content,
      subject: `📰 [RAOK] - read article - "${readableArticle?.title}" (${readableArticle?.readingTime} min)`,
    };
  }
}
