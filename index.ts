import express from "express";
import * as bg from "@bgord/node";

import * as Service from "./services";
import * as Routes from "./routes";
import * as VO from "./value-objects";

import { Scheduler } from "./jobs";
import { ErrorHandler } from "./error-handler";
import { Env } from "./env";
import { logger } from "./logger";

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
    mailer: Service.Mailer,
  }),
];

const Session = new bg.Session({
  secret: Env.COOKIE_SECRET,
  store: bg.SessionFileStore.build({ ttl: bg.Time.Days(3).toSeconds() }),
});

const AuthShield = new bg.EnvUserAuthShield({
  ADMIN_USERNAME: Env.ADMIN_USERNAME,
  ADMIN_PASSWORD: Env.ADMIN_PASSWORD,
});

const BasicAuthShield = new bg.BasicAuthShield({
  username: Env.BASIC_AUTH_USERNAME,
  password: Env.BASIC_AUTH_PASSWORD,
});

const app = express();

bg.addExpressEssentials(app);
bg.Handlebars.applyTo(app);
bg.Language.applyTo(app, bg.Schema.Path.parse("translations"));
Session.applyTo(app);
AuthShield.applyTo(app);
bg.HttpLogger.applyTo(app, logger);

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
  bg.Cache.handle(bg.CacheStrategy.never),
  bg.Route(Routes.Dashboard)
);

app.get(
  "/healthcheck",
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
app.use(ErrorHandler.handle);

(async function main() {
  await bg.GracefulStartup.check({
    port: Env.PORT,
    callback: () => {
      logger.error({
        message: "Busy port",
        operation: "server_startup_error",
        metadata: { port: Env.PORT },
      });

      process.exit(1);
    },
  });

  const server = app.listen(Env.PORT, async () => {
    await bg.Prerequisites.check(prerequisites);

    logger.info({
      message: "Server has started",
      operation: "server_startup",
      metadata: { port: Env.PORT },
    });
  });

  bg.GracefulShutdown.applyTo(server, () => {
    logger.info({
      message: "Shutting down job scheduler",
      operation: "scheduler_shutdown",
    });
    Scheduler.stop();
  });
})();
