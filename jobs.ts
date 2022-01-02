import { Reporter } from "@bgord/node";
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";

import * as Services from "./services";
import * as VO from "./value-objects";
import { Article } from "./aggregates/article";

export const Scheduler = new ToadScheduler();

const task = new AsyncTask("feedly articles crawler", async () => {
  Reporter.info("Crawling Feedly articles...");

  const articleUrls = await Services.Feedly.getArticles();

  for (const articleUrl of articleUrls) {
    try {
      await Article.add({
        url: articleUrl,
        source: VO.ArticleSourceEnum.feedly,
      });
      Reporter.success(`Added article from feedly [url=${articleUrl}]`);
    } catch (error) {
      Reporter.error(`Article not added [url=${articleUrl}]`);
    }
  }
});

const job = new SimpleIntervalJob(
  { minutes: 100, runImmediately: false },
  task
);

Scheduler.addSimpleIntervalJob(job);
