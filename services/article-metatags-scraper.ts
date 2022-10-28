import * as bg from "@bgord/node";
import og from "open-graph-scraper";

import * as VO from "../value-objects";

export class ArticleMetatagsScraper {
  static async get(url: VO.ArticleUrlType): Promise<VO.ArticleMetatagsType> {
    const emptyMetatags = { title: undefined };

    try {
      const response = (await og({ url })).result;

      if (response.success) {
        return VO.ArticleMetatags.parse({ title: response.ogTitle });
      }

      return VO.ArticleMetatags.parse(emptyMetatags);
    } catch (error) {
      bg.Reporter.raw("ArticleMetatagsScraper#get", error);

      return VO.ArticleMetatags.parse(emptyMetatags);
    }
  }
}
