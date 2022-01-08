import og from "open-graph-scraper";

import * as VO from "../value-objects";

export class ArticleMetatagsScraper {
  static async get(url: VO.ArticleUrlType): Promise<VO.ArticleMetatagsType> {
    const response = (await og({ url })).result;

    if (response.success) {
      return VO.ArticleMetatags.parse({
        title: response.ogTitle,
        description: response.ogDescription,
      });
    }

    return VO.ArticleMetatags.parse({
      title: undefined,
      description: undefined,
    });
  }
}
