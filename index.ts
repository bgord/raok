import express from "express";
import * as bg from "@bgord/node";

import * as Routes from "./routes";
import * as VO from "./value-objects";
import * as infra from "./infra";

const prerequisites = [
  new bg.Prerequisite({
    label: "pandoc",
    binary: "pandoc",
    strategy: bg.PrerequisiteStrategyEnum.exists,
  }),

  new bg.Prerequisite({
    label: "calibre",
    binary: "ebook-convert",
    strategy: bg.PrerequisiteStrategyEnum.exists,
  }),

  new bg.Prerequisite({
    label: "nodemailer",
    strategy: bg.PrerequisiteStrategyEnum.mailer,
    mailer: infra.Mailer,
  }),
];

const Session = new bg.Session({
  secret: infra.Env.COOKIE_SECRET,
  store: bg.SessionFileStore.build({ ttl: bg.Time.Days(3).toSeconds() }),
});

const AuthShield = new bg.EnvUserAuthShield({
  ADMIN_USERNAME: infra.Env.ADMIN_USERNAME,
  ADMIN_PASSWORD: infra.Env.ADMIN_PASSWORD,
});

const BasicAuthShield = new bg.BasicAuthShield({
  username: infra.Env.BASIC_AUTH_USERNAME,
  password: infra.Env.BASIC_AUTH_PASSWORD,
});

const app = express();

bg.addExpressEssentials(app);
bg.Handlebars.applyTo(app);
bg.Language.applyTo(app, bg.Schema.Path.parse("infra/translations"));
Session.applyTo(app);
AuthShield.applyTo(app);
bg.HttpLogger.applyTo(app, infra.logger);

app.get("/", bg.CsrfShield.attach, bg.Route(Routes.Home));

app.get("/articles", AuthShield.verify, bg.Route(Routes.Articles));
app.get("/articles/search", AuthShield.verify, bg.Route(Routes.ArticlesSearch));
app.get(
  "/articles/archive",
  AuthShield.verify,
  bg.Route(Routes.ArchiveArticles)
);

app.post("/add-article", AuthShield.verify, bg.Route(Routes.AddArticle));
app.post(
  "/delete-article/:articleId",
  AuthShield.verify,
  bg.Route(Routes.DeleteArticle)
);
app.post(
  "/undelete-article/:articleId",
  AuthShield.verify,
  bg.Route(Routes.UndeleteArticle)
);
app.post(
  "/articles/all/delete",
  AuthShield.verify,
  bg.Route(Routes.DeleteAllArticles)
);
app.post(
  "/articles/old/delete",
  AuthShield.verify,
  bg.Route(Routes.DeleteOldArticles)
);

app.get("/newspapers", AuthShield.verify, bg.Route(Routes.Newspapers));
app.get(
  "/newspapers/archive",
  AuthShield.verify,
  bg.Route(Routes.ArchiveNewspapers)
);
app.get(
  "/newspaper/:newspaperId",
  AuthShield.verify,
  bg.Route(Routes.SingleNewspaper)
);
app.get(
  "/newspaper/:newspaperId/read",
  AuthShield.verify,
  bg.Route(Routes.NewspaperRead)
);
app.post(
  "/create-newspaper",
  AuthShield.verify,
  bg.Route(Routes.CreateNewspaper)
);
app.post(
  "/archive-newspaper/:newspaperId",
  AuthShield.verify,
  bg.Route(Routes.ArchiveNewspaper)
);
app.post(
  "/cancel-newspaper/:newspaperId",
  AuthShield.verify,
  bg.Route(Routes.CancelNewspaper)
);
app.post(
  "/resend-newspaper/:newspaperId",
  AuthShield.verify,
  bg.Route(Routes.ResendNewspaper)
);

app.post(
  "/send-arbitrary-file",
  AuthShield.verify,
  ...bg.FileUploader.handle({
    autoClean: false,
    maxFilesSize: VO.MAX_UPLOADED_FILE_SIZE_BYTES,
    uploadDir: "files",
    mimeTypes: VO.FileMimeTypes.value,
  }),
  bg.Route(Routes.SendArbitraryFile)
);
app.get("/files/archive", AuthShield.verify, bg.Route(Routes.ArchiveFiles));
app.get(
  "/files/archive/:fileId/download",
  AuthShield.verify,
  bg.Route(Routes.DownloadFile)
);

app.get("/stats", AuthShield.verify, bg.Route(Routes.Stats));
app.get("/settings", AuthShield.verify, bg.Route(Routes.Dashboard));
app.get("/account/settings", AuthShield.verify, bg.Route(Routes.Settings));

app.post(
  "/disable-articles-to-review-notification",
  AuthShield.verify,
  bg.Route(Routes.DisableArticlesToReviewNotification)
);
app.post(
  "/enable-articles-to-review-notification",
  AuthShield.verify,
  bg.Route(Routes.EnableArticlesToReviewNotification)
);
app.post(
  "/set-articles-to-review-notification-hour",
  AuthShield.verify,
  bg.Route(Routes.SetArticlesToReviewNotificationHour)
);

app.post(
  "/stop-feedly-crawling",
  AuthShield.verify,
  bg.Route(Routes.StopFeedlyCrawling)
);
app.post(
  "/restore-feedly-crawling",
  AuthShield.verify,
  bg.Route(Routes.RestoreFeedlyCrawling)
);

app.get(
  "/archive/articles",
  AuthShield.verify,
  bg.Route(Routes.ArticlesArchive)
);
app.get(
  "/archive/newspapers",
  AuthShield.verify,
  bg.Route(Routes.NewspapersArchive)
);
app.get("/archive/files", AuthShield.verify, bg.Route(Routes.FilesArchive));

app.post(
  "/schedule-feedly-articles-crawl",
  bg.RateLimitShield.build({ limitMs: bg.Time.Seconds(30).toMs() }),
  AuthShield.verify,
  bg.Route(Routes.ScheduleFeedlyArticlesCrawl)
);

app.post(
  "/login",
  bg.CsrfShield.verify,
  AuthShield.attach,
  (_request, response) => response.redirect("/dashboard")
);
app.get("/logout", AuthShield.detach, (_, response) => response.redirect("/"));

app.get(
  "/dashboard",
  AuthShield.verify,
  bg.CacheStaticFiles.handle(bg.CacheStaticFilesStrategy.never),
  bg.Route(Routes.Dashboard)
);

app.get(
  "/healthcheck",
  bg.RateLimitShield.build({ limitMs: bg.Time.Minutes(1).toMs() }),
  bg.Timeout.build({ timeoutMs: bg.Time.Seconds(5).toMs() }),
  BasicAuthShield.verify,
  bg.Healthcheck.build([
    ...prerequisites,
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
    await bg.Prerequisites.check(prerequisites);

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
    infra.Scheduler.stop();
  });
})();
