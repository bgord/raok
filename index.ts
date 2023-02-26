import express from "express";
import * as bg from "@bgord/node";

import * as Service from "./services";
import * as Routes from "./routes";
import * as VO from "./value-objects";

import { Scheduler } from "./jobs";
import { ErrorHandler } from "./error-handler";
import { Env } from "./env";
import { logger } from "./logger";

const app = express();

bg.addExpressEssentials(app);
bg.Handlebars.applyTo(app);
bg.Language.applyTo(app, bg.Schema.Path.parse("translations"));

new bg.Session({
  secret: Env.COOKIE_SECRET,
  store: bg.SessionFileStore.build({ ttl: bg.Time.Days(3).toSeconds() }),
}).applyTo(app);

const AuthShield = new bg.EnvUserAuthShield({
  ADMIN_USERNAME: Env.ADMIN_USERNAME,
  ADMIN_PASSWORD: Env.ADMIN_PASSWORD,
});
AuthShield.applyTo(app);

app.use((_request, response, next) => {
  const oldJson = response.json;

  response.json = (body) => {
    response.locals.body = body;
    return oldJson.call(response, body);
  };

  next();
});

app.use((request, response, next) => {
  const client = {
    ip: request.header("X-Real-IP") ?? request.ip,
    userAgent: request.header("user-agent"),
  };

  logger.http({
    operation: "http_request_before",
    message: "request",
    method: request.method,
    url: `${request.header("host")}${request.url}`,
    client,
  });

  response.on("finish", () => {
    logger.http({
      operation: "http_request_after",
      message: "response",
      method: request.method,
      url: `${request.header("host")}${request.url}`,
      responseCode: response.statusCode,
      client,
      metadata: { response: response.locals.body },
    });
  });

  next();
});

app.get("/", bg.CsrfShield.attach, bg.Route(Routes.Home));

app.get("/articles", AuthShield.verify, bg.Route(Routes.Articles));
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

app.get("*", (_, response) => response.redirect("/"));
app.use(ErrorHandler.handle);

const server = app.listen(Env.PORT, async () => {
  await bg.Prerequisites.check([
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
  ]);

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
