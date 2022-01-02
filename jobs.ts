import { Reporter } from "@bgord/node";
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";

import * as Services from "./services";
import * as VO from "./value-objects";
import { Article } from "./aggregates/article";

export const Scheduler = new ToadScheduler();

const task = new AsyncTask("feedly articles crawler", async () => {
  Reporter.info("Crawling Feedly articles...");

  const articles = await Services.Feedly.getArticles();
  Reporter.info(`Got ${articles.length} unread article(s).`);

  if (articles.length === 0) return;

  const insertedArticlesFeedlyIds: VO.FeedlyArticleType["id"][] = [];

  for (const article of articles) {
    try {
      await Article.add({
        url: article.canonicalUrl,
        source: VO.ArticleSourceEnum.feedly,
      });
      insertedArticlesFeedlyIds.push(article.id);

      Reporter.success(
        `Added article from feedly [url=${article.canonicalUrl}]`
      );
    } catch (error) {
      Reporter.error(`Article not added [url=${article.canonicalUrl}]`);
    }
  }

  try {
    await Services.Feedly.markArticlesAsRead(insertedArticlesFeedlyIds);
    Reporter.success(
      `Marked Feedly articles as read [ids=${insertedArticlesFeedlyIds}]`
    );
  } catch (error) {
    Reporter.error("Failed to mark Feedly articles as read");
  }
});

const job = new SimpleIntervalJob(
  { minutes: 100, runImmediately: false },
  task
);

Scheduler.addSimpleIntervalJob(job);
