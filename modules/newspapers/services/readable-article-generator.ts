import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

import { ReadingTimeCalculator } from "../services/estimated-reading-time-calculator";
import * as VO from "../value-objects";

type ReadableArticleContentGeneratorConfigType = {
  url: VO.ArticleType["url"];
  content: VO.ArticleContentType;
};

export class ReadableArticleGenerator {
  static generate(
    config: ReadableArticleContentGeneratorConfigType
  ): VO.ReadableArticleType | null {
    const document = new JSDOM(config.content, { url: config.url });
    const article = new Readability(document.window.document).parse();

    if (!article) return null;

    const readableArticleContent = VO.ArticleContent.parse(article.content);

    return {
      content: readableArticleContent,
      title: VO.ArticleTitle.parse(article.title),
      readingTime: ReadingTimeCalculator.getMinutes(readableArticleContent),
    };
  }
}
