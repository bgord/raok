import express from "express";
import * as bg from "@bgord/node";

import * as Routes from "./routes";
import * as VO from "./value-objects";
import * as infra from "./infra";

import { Scheduler } from "./jobs";

const app = express();

bg.addExpressEssentials(app);
bg.Handlebars.applyTo(app);
bg.I18n.applyTo(app, { supportedLanguages: infra.SupportedLanguages });
infra.Session.applyTo(app);
infra.AuthShield.applyTo(app);
bg.HttpLogger.applyTo(app, infra.logger);

app.get("/", bg.CsrfShield.attach, bg.Route(Routes.Home));

app.get("/articles", infra.AuthShield.verify, bg.Route(Routes.Articles));
app.get(
  "/articles/search",
  infra.AuthShield.verify,
  bg.Route(Routes.ArticlesSearch)
);
app.get(
  "/articles/archive",
  infra.AuthShield.verify,
  bg.Route(Routes.ArchiveArticles)
);

app.post("/add-article", infra.AuthShield.verify, bg.Route(Routes.AddArticle));
app.post(
  "/delete-article/:articleId",
  infra.AuthShield.verify,
  bg.Route(Routes.DeleteArticle)
);
app.post(
  "/undelete-article/:articleId",
  infra.AuthShield.verify,
  bg.Route(Routes.UndeleteArticle)
);
app.post(
  "/articles/all/delete",
  infra.AuthShield.verify,
  bg.Route(Routes.DeleteAllArticles)
);
app.post(
  "/articles/old/delete",
  infra.AuthShield.verify,
  bg.Route(Routes.DeleteOldArticles)
);

app.get("/newspapers", infra.AuthShield.verify, bg.Route(Routes.Newspapers));
app.get(
  "/newspapers/archive",
  infra.AuthShield.verify,
  bg.Route(Routes.ArchiveNewspapers)
);
app.get(
  "/newspaper/:newspaperId",
  infra.AuthShield.verify,
  bg.Route(Routes.SingleNewspaper)
);
app.get(
  "/newspaper/:newspaperId/read",
  infra.AuthShield.verify,
  bg.Route(Routes.NewspaperRead)
);
app.post(
  "/create-newspaper",
  infra.AuthShield.verify,
  bg.Route(Routes.CreateNewspaper)
);
app.post(
  "/archive-newspaper/:newspaperId",
  infra.AuthShield.verify,
  bg.Route(Routes.ArchiveNewspaper)
);
app.post(
  "/cancel-newspaper/:newspaperId",
  infra.AuthShield.verify,
  bg.Route(Routes.CancelNewspaper)
);
app.post(
  "/resend-newspaper/:newspaperId",
  infra.AuthShield.verify,
  bg.Route(Routes.ResendNewspaper)
);

app.post(
  "/send-arbitrary-file",
  infra.AuthShield.verify,
  ...bg.FileUploader.handle({
    autoClean: false,
    maxFilesSize: VO.MAX_UPLOADED_FILE_SIZE_BYTES,
    uploadDir: "files",
    mimeTypes: VO.FileMimeTypes.value,
  }),
  bg.Route(Routes.SendArbitraryFile)
);
app.get(
  "/files/archive",
  infra.AuthShield.verify,
  bg.Route(Routes.ArchiveFiles)
);
app.get(
  "/files/archive/:fileId/download",
  infra.AuthShield.verify,
  bg.Route(Routes.DownloadFile)
);

app.get("/stats", infra.AuthShield.verify, bg.Route(Routes.Stats));
app.get("/settings", infra.AuthShield.verify, bg.Route(Routes.Dashboard));
app.get(
  "/account/settings",
  infra.AuthShield.verify,
  bg.Route(Routes.Settings)
);

app.post(
  "/disable-articles-to-review-notification",
  infra.AuthShield.verify,
  bg.Route(Routes.DisableArticlesToReviewNotification)
);
app.post(
  "/enable-articles-to-review-notification",
  infra.AuthShield.verify,
  bg.Route(Routes.EnableArticlesToReviewNotification)
);
app.post(
  "/set-articles-to-review-notification-hour",
  infra.AuthShield.verify,
  bg.Route(Routes.SetArticlesToReviewNotificationHour)
);

app.post(
  "/stop-feedly-crawling",
  infra.AuthShield.verify,
  bg.Route(Routes.StopFeedlyCrawling)
);
app.post(
  "/restore-feedly-crawling",
  infra.AuthShield.verify,
  bg.Route(Routes.RestoreFeedlyCrawling)
);

app.get(
  "/archive/articles",
  infra.AuthShield.verify,
  bg.Route(Routes.ArticlesArchive)
);
app.get(
  "/archive/newspapers",
  infra.AuthShield.verify,
  bg.Route(Routes.NewspapersArchive)
);
app.get(
  "/archive/files",
  infra.AuthShield.verify,
  bg.Route(Routes.FilesArchive)
);

app.post(
  "/schedule-feedly-articles-crawl",
  bg.RateLimitShield.build({ limitMs: bg.Time.Seconds(30).ms }),
  infra.AuthShield.verify,
  bg.Route(Routes.ScheduleFeedlyArticlesCrawl)
);

app.post(
  "/login",
  bg.CsrfShield.verify,
  infra.AuthShield.attach,
  (_request, response) => response.redirect("/dashboard")
);
app.get("/logout", infra.AuthShield.detach, (_, response) =>
  response.redirect("/")
);

app.get(
  "/dashboard",
  infra.AuthShield.verify,
  bg.CacheStaticFiles.handle(bg.CacheStaticFilesStrategy.never),
  bg.Route(Routes.Dashboard)
);

app.get(
  "/healthcheck",
  bg.RateLimitShield.build({ limitMs: bg.Time.Minutes(1).ms }),
  bg.Timeout.build({ timeoutMs: bg.Time.Seconds(5).ms }),
  infra.BasicAuthShield.verify,
  bg.Healthcheck.build([
    ...infra.prerequisites,
    new bg.Prerequisite({
      label: "api",
      strategy: bg.PrerequisiteStrategyEnum.self,
    }),
  ])
);

app.get("*", (_, response) => response.redirect("/"));
app.use(Routes.ErrorHandler.handle);

(async function main() {
  await bg.GracefulStartup.check({
    port: infra.Env.PORT,
    callback: () => {
      infra.logger.error({
        message: "Busy port",
        operation: "server_startup_error",
        metadata: { port: infra.Env.PORT },
      });

      process.exit(1);
    },
  });

  const server = app.listen(infra.Env.PORT, async () => {
    await bg.Prerequisites.check(infra.prerequisites);

    infra.logger.info({
      message: "Server has started",
      operation: "server_startup",
      metadata: { port: infra.Env.PORT },
    });
  });

  bg.GracefulShutdown.applyTo(server, () => {
    infra.logger.info({
      message: "Shutting down job scheduler",
      operation: "scheduler_shutdown",
    });
    Scheduler.stop();
  });
})();
