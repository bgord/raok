import { Reporter } from "@bgord/node";

import * as VO from "../value-objects";
import * as Policies from "../policies";
import * as Aggregates from "../aggregates";
import { Feedly } from "./feedly";
import { Env } from "../env";

export class FeedlyArticlesCrawler {
  static async run() {
    Reporter.info("Crawling Feedly articles...");

    if (Env.SUPRESS_FEEDLY_CRAWLING === "yes") {
      Reporter.info("Suppressing Feedly crawling due to feature flag");
      return;
    }

    const settings = await new Aggregates.Settings().build();
    if (Policies.ShouldCrawlFeedly.fails({ settings })) {
      Reporter.info(
        "Suppressing Feedly crawling due to settings.isFeedlyCrawlingStopped"
      );
      return;
    }

    const articles = await Feedly.getArticles();
    Reporter.info(`Got ${articles.length} unread article(s).`);

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

        Reporter.success(
          `Added article from Feedly [url=${article.canonicalUrl}]`
        );
      } catch (error) {
        Reporter.error(`Article not added [url=${article.canonicalUrl}]`);
      }
    }

    try {
      if (insertedArticlesFeedlyIds.length === 0) return;

      await Feedly.markArticlesAsRead(insertedArticlesFeedlyIds);
      Reporter.success(
        `Marked Feedly articles as read [ids=${insertedArticlesFeedlyIds}]`
      );
    } catch (error) {
      Reporter.error("Failed to mark Feedly articles as read");
    }
  }
}
