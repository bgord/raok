import { Reporter } from "@bgord/node";
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";

import * as Services from "./services";
import * as VO from "./value-objects";
import { Env } from "./env";

import { Article } from "./aggregates/article";

export const Scheduler = new ToadScheduler();

const FeedlyArticlesCrawlerTask = new AsyncTask(
  "feedly articles crawler",
  async () => {
    Reporter.info("Crawling Feedly articles...");

    if (Env.SUPRESS_FEEDLY_CRAWLING === "yes") {
      Reporter.info("Suppressing Feedly crawling due to feature flag");
      return;
    }

    const articles = await Services.Feedly.getArticles();
    Reporter.info(`Got ${articles.length} unread article(s).`);

    if (articles.length === 0) return;

    const insertedArticlesFeedlyIds: VO.FeedlyArticleType["id"][] = [];

    for (const article of articles) {
      if (!article.canonicalUrl) continue;

      try {
        await Article.add({
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

      await Services.Feedly.markArticlesAsRead(insertedArticlesFeedlyIds);
      Reporter.success(
        `Marked Feedly articles as read [ids=${insertedArticlesFeedlyIds}]`
      );
    } catch (error) {
      Reporter.error("Failed to mark Feedly articles as read");
    }
  }
);

const ArtclesToReviewNotifierTask = new AsyncTask(
  "artcles to review notifier",
  async () => {
    const notification = await new Services.ArticlesToReviewNotifier().build();

    if (notification.shouldBeSent()) {
      try {
        await notification.send();
        Reporter.success("Articles to review notification sent");
      } catch (error) {
        Reporter.raw("artcles to review notification sent", error);
      }
    }
  }
);

const FeedlyArticlesCrawlerJob = new SimpleIntervalJob(
  { hours: 2, runImmediately: false },
  FeedlyArticlesCrawlerTask
);

const ArtclesToReviewNotifierJob = new SimpleIntervalJob(
  { minutes: 1, runImmediately: true },
  ArtclesToReviewNotifierTask
);

Scheduler.addSimpleIntervalJob(FeedlyArticlesCrawlerJob);
Scheduler.addSimpleIntervalJob(ArtclesToReviewNotifierJob);
