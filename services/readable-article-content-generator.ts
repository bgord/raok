import _ from "lodash";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

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

    return article ? _.pick(article, "title", "content") : null;
  }
}
