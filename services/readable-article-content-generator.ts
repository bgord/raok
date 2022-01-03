import _ from "lodash";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

import * as Services from "../services";
import * as VO from "../value-objects";

type ReadableArticleContentGeneratorConfigType = {
  url: VO.ArticleType["url"];
  content: VO.ArticleContentType;
};

export class ReadableArticleContentGenerator {
  static generate(
    config: ReadableArticleContentGeneratorConfigType
  ): VO.ReadableArticleType | null {
    const document = new JSDOM(config.content, { url: config.url });
    const article = new Readability(document.window.document).parse();

    if (!article) return null;

    const readingTime = Services.ReadingTimeCalculator.calculateMinutes(
      article.content
    );

    return { ..._.pick(article, "title", "content"), readingTime };
  }
}
