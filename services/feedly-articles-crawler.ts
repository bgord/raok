import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as Policies from "../policies";
import * as Aggregates from "../aggregates";
import { Feedly } from "./feedly";
import { Env } from "../env";
import { logger } from "../logger";

export class FeedlyArticlesCrawler {
  static async run() {
    const correlationId = bg.Schema.CorrelationId.parse(bg.NewUUID.generate());

    logger.info({
      message: "Crawling Feedly articles",
      operation: "feedly_crawl_start",
      correlationId,
    });

    if (Env.SUPRESS_FEEDLY_CRAWLING === "yes") {
      logger.info({
        message: "Suppressing Feedly crawling stopped",
        operation: "feedly_crawl_suppressed",
        metadata: { reason: "feature flag" },
        correlationId,
      });

      return;
    }

    const settings = await new Aggregates.Settings().build();
    if (Policies.ShouldCrawlFeedly.fails({ settings })) {
      logger.info({
        message: "Suppressing Feedly crawling stopped",
        operation: "feedly_crawl_suppressed",
        metadata: { reason: "settings" },
        correlationId,
      });

      return;
    }

    const articles = await Feedly.getArticles();
    logger.info({
      message: `Crawled ${articles.length} unread articles`,
      operation: "feedly_crawl_report",
      correlationId,
    });

    if (articles.length === 0) return;

    const insertedArticlesFeedlyIds: VO.FeedlyArticleType["id"][] = [];

    for (const article of articles) {
      if (!article.canonicalUrl) continue;

      try {
        await Aggregates.Article.add({
          url: article.canonicalUrl,
          source: VO.ArticleSourceEnum.feedly,
        });
        insertedArticlesFeedlyIds.push(article.id);

        logger.info({
          message: `Added article from Feedly`,
          operation: "feedly_crawl_article_added",
          metadata: { id: article.canonicalUrl },
          correlationId,
        });
      } catch (error) {
        logger.error({
          message: `Article not added`,
          operation: "feedly_crawl_article_add_error",
          metadata: { id: article.canonicalUrl },
          correlationId,
        });
      }
    }

    try {
      if (insertedArticlesFeedlyIds.length === 0) return;

      await Feedly.markArticlesAsRead(insertedArticlesFeedlyIds);

      logger.info({
        message: "Marked Feedly articles as read",
        operation: "feedly_crawl_mark_as_read_success",
        metadata: { ids: insertedArticlesFeedlyIds },
        correlationId,
      });
    } catch (error) {
      logger.error({
        message: "Failed to mark Feedly articles as read",
        operation: "feedly_crawl_mark_as_read_error",
        metadata: { ids: insertedArticlesFeedlyIds },
        correlationId,
      });
    }
  }
}
