import * as bg from "@bgord/node";
import og from "open-graph-scraper";

import { logger } from "../logger";
import * as VO from "../value-objects";

export class ArticleMetatagsScraper {
  static async get(url: VO.ArticleUrlType): Promise<VO.ArticleMetatagsType> {
    const emptyMetatags = { title: undefined };

    try {
      const response = await og({ url, timeout: bg.Time.Seconds(30).toMs() });

      if (response.result.success) {
        return VO.ArticleMetatags.parse({ title: response.result.ogTitle });
      }

      return VO.ArticleMetatags.parse(emptyMetatags);
    } catch (error) {
      const response = error as og.ErrorResult;

      logger.warn({
        message: "Article scrapping error",
        operation: "article_scrapping_error_warning",
        metadata: {
          error: response.result.error,
          details: response.result.errorDetails,
        },
      });

      if (response.result.error === "Page not found") {
        throw new VO.ArticleNotFoundError();
      }

      if (response.result.error === "Must scrape an HTML page") {
        throw new VO.ArticleIsNotHTML();
      }

      if (response.result.error === "Time out") {
        throw new VO.ArticleScrapingTimeoutError();
      }

      return VO.ArticleMetatags.parse(emptyMetatags);
    }
  }
}
