import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as Policies from "../policies";
import * as Aggregates from "../aggregates";
import { Feedly } from "./feedly";
import { Env } from "../env";

export class FeedlyArticlesCrawler {
  static async run() {
    bg.Reporter.info("Crawling Feedly articles...");

    if (Env.SUPRESS_FEEDLY_CRAWLING === "yes") {
      bg.Reporter.info("Suppressing Feedly crawling due to feature flag");
      return;
    }

    const settings = await new Aggregates.Settings().build();
    if (Policies.ShouldCrawlFeedly.fails({ settings })) {
      bg.Reporter.info(
        "Suppressing Feedly crawling due to settings.isFeedlyCrawlingStopped"
      );
      return;
    }

    const articles = await Feedly.getArticles();
    bg.Reporter.info(`Got ${articles.length} unread article(s).`);

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

        bg.Reporter.success(
          `Added article from Feedly [url=${article.canonicalUrl}]`
        );
      } catch (error) {
        bg.Reporter.error(`Article not added [url=${article.canonicalUrl}]`);
      }
    }

    try {
      if (insertedArticlesFeedlyIds.length === 0) return;

      await Feedly.markArticlesAsRead(insertedArticlesFeedlyIds);
      bg.Reporter.success(
        `Marked Feedly articles as read [ids=${insertedArticlesFeedlyIds}]`
      );
    } catch (error) {
      bg.Reporter.error("Failed to mark Feedly articles as read");
    }
  }
}
