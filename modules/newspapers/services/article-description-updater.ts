import { db } from "../../../infra/db";
import { logger } from "../../../infra/logger";
import { SummaryCreator } from "./summary-creator";
import { ArticleContentDownloader } from "./article-content-downloader";

export class ArticleDescriptionUpdater {
  static async update() {
    const articles = await db.article.findMany({
      where: { status: "ready", description: null },
      take: 10,
    });

    const summaryCreator = await SummaryCreator.build();

    for (const article of articles) {
      try {
        const content = await ArticleContentDownloader.download(article.url);
        if (!content) continue;

        const summary = await summaryCreator.summarize(content);
        if (!summary) continue;

        await db.article.update({
          where: { id: article.id },
          data: { description: summary },
        });
      } catch (error) {
        logger.error({
          message: "Article description updater failed",
          operation: "article_description_updater_failure",
          metadata: { error: logger.formatError(error) },
        });
      }
    }
  }
}
