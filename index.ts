import express from "express";
import * as bg from "@bgord/node";

import * as App from "./app";

import * as RSS from "./modules/rss";
import * as Settings from "./modules/settings";
import * as Stats from "./modules/stats";
import * as Files from "./modules/files";
import * as Newspapers from "./modules/newspapers";
import * as Reordering from "./modules/reordering";
import * as Recommendations from "./modules/recommendations";

import * as infra from "./infra";

const app = express();

bg.addExpressEssentials(app);
bg.Handlebars.applyTo(app);
bg.I18n.applyTo(app, { supportedLanguages: infra.SupportedLanguages });
infra.Session.applyTo(app);
infra.AuthShield.applyTo(app);
bg.HttpLogger.applyTo(app, infra.logger);

// Auth ========================
app.get("/", bg.CsrfShield.attach, bg.Route(App.Routes.Home));
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
  bg.Route(App.Routes.Dashboard)
);

// =============================

// Articles ====================
app.get(
  "/articles",
  infra.AuthShield.verify,
  bg.Route(Newspapers.Routes.Articles)
);
app.get(
  "/articles/search",
  infra.AuthShield.verify,
  bg.Route(Newspapers.Routes.ArticlesSearch)
);
app.get(
  "/articles/archive",
  infra.AuthShield.verify,
  bg.Route(Newspapers.Routes.ArchiveArticles)
);
app.post(
  "/add-article",
  infra.AuthShield.verify,
  bg.Route(Newspapers.Routes.AddArticle)
);
app.post(
  "/delete-article/:articleId",
  infra.AuthShield.verify,
  bg.Route(Newspapers.Routes.DeleteArticle)
);
app.post(
  "/undelete-article/:articleId",
  infra.AuthShield.verify,
  bg.Route(Newspapers.Routes.UndeleteArticle)
);
app.post(
  "/article/:articleId/mark-as-read",
  infra.AuthShield.verify,
  bg.Route(Newspapers.Routes.ArticleMarkAsRead)
);
app.post(
  "/article/:articleId/opened",
  infra.AuthShield.verify,
  bg.Route(Newspapers.Routes.ArticleOpened)
);
app.get(
  "/archive/articles",
  infra.AuthShield.verify,
  bg.Route(Newspapers.Routes.ArticlesArchive)
);
// =============================

// Newspapers ==================
app.get(
  "/newspapers",
  infra.AuthShield.verify,
  bg.Route(Newspapers.Routes.Newspapers)
);
app.get(
  "/newspaper/:newspaperId",
  infra.AuthShield.verify,
  bg.Route(Newspapers.Routes.SingleNewspaper)
);
app.get(
  "/newspaper/:newspaperId/read",
  infra.AuthShield.verify,
  bg.Route(Newspapers.Routes.NewspaperRead)
);
app.post(
  "/create-newspaper",
  infra.AuthShield.verify,
  bg.Route(Newspapers.Routes.CreateNewspaper)
);
app.post(
  "/archive-newspaper/:newspaperId",
  infra.AuthShield.verify,
  bg.Route(Newspapers.Routes.ArchiveNewspaper)
);
app.post(
  "/cancel-newspaper/:newspaperId",
  infra.AuthShield.verify,
  bg.Route(Newspapers.Routes.CancelNewspaper)
);
app.post(
  "/resend-newspaper/:newspaperId",
  infra.AuthShield.verify,
  bg.Route(Newspapers.Routes.ResendNewspaper)
);
// =============================

// Files =======================
app.post(
  "/send-arbitrary-file",
  infra.AuthShield.verify,
  ...bg.FileUploader.handle({
    autoClean: false,
    maxFilesSize: Files.VO.MAX_UPLOADED_FILE_SIZE_BYTES,
    uploadDir: "files",
    mimeTypes: Files.VO.FileMimeTypes.value,
  }),
  bg.Route(Files.Routes.SendArbitraryFile)
);
app.get(
  "/files/archive/:fileId/download",
  infra.AuthShield.verify,
  bg.Route(Files.Routes.DownloadFile)
);
app.get(
  "/files/archive",
  infra.AuthShield.verify,
  bg.Route(Files.Routes.ArchiveFiles)
);
app.get(
  "/archive/files",
  infra.AuthShield.verify,
  bg.Route(Files.Routes.FilesArchive)
);
// =============================

// Stats =======================
app.get("/stats", infra.AuthShield.verify, bg.Route(Stats.Routes.Stats));
// =============================

// Settings ====================
app.get("/settings", infra.AuthShield.verify, bg.Route(App.Routes.Dashboard));
app.get(
  "/account/settings",
  infra.AuthShield.verify,
  bg.Route(Settings.Routes.Settings)
);
app.post(
  "/disable-articles-to-review-notification",
  infra.AuthShield.verify,
  bg.Route(Settings.Routes.DisableArticlesToReviewNotification)
);
app.post(
  "/enable-articles-to-review-notification",
  infra.AuthShield.verify,
  bg.Route(Settings.Routes.EnableArticlesToReviewNotification)
);
app.post(
  "/set-articles-to-review-notification-hour",
  infra.AuthShield.verify,
  bg.Route(Settings.Routes.SetArticlesToReviewNotificationHour)
);
// =============================

// Source ======================
app.get("/sources", infra.AuthShield.verify, bg.Route(RSS.Routes.Sources));
app.post(
  "/rss/source/create",
  infra.AuthShield.verify,
  infra.CacheResponse.clear,
  bg.Route(RSS.Routes.SourceCreate)
);
app.delete(
  "/rss/source/:sourceId",
  infra.AuthShield.verify,
  infra.CacheResponse.clear,
  bg.Route(RSS.Routes.SourceDelete)
);
app.post(
  "/rss/source/:sourceId/archive",
  infra.AuthShield.verify,
  infra.CacheResponse.clear,
  bg.Route(RSS.Routes.SourceArchive)
);
app.post(
  "/rss/source/:sourceId/reactivate",
  infra.AuthShield.verify,
  infra.CacheResponse.clear,
  bg.Route(RSS.Routes.SourceReactivate)
);
app.get(
  "/rss/source/list",
  infra.AuthShield.verify,
  infra.CacheResponse.handle,
  bg.Route(RSS.Routes.SourceList)
);
// =============================

// Healthcheck =================
app.get(
  "/healthcheck",
  bg.RateLimitShield.build(bg.Time.Seconds(15)),
  bg.Timeout.build(bg.Time.Seconds(15)),
  infra.BasicAuthShield.verify,
  bg.Healthcheck.build(infra.healthcheck)
);
// =============================

// Reordering ==================
app.post(
  "/reordering/:correlationId/transfer",
  infra.AuthShield.verify,
  infra.CacheResponse.clear,
  bg.Route(Reordering.Routes.ReorderingTransfer)
);
// =============================

// Recommendations =============
app.get(
  "/token-blacklist",
  infra.AuthShield.verify,
  infra.CacheResponse.handle,
  bg.Route(Recommendations.Routes.TokenBlacklist)
);

app.post(
  "/token-blacklist/create",
  infra.AuthShield.verify,
  infra.CacheResponse.clear,
  bg.Route(Recommendations.Routes.BlacklistedTokenCreate)
);

app.post(
  "/token-blacklist/delete",
  infra.AuthShield.verify,
  infra.CacheResponse.clear,
  bg.Route(Recommendations.Routes.BlacklistedTokenDelete)
);

app.get(
  "/token-blacklist/suggestions",
  infra.AuthShield.verify,
  infra.CacheResponse.handle,
  bg.Route(Recommendations.Routes.BlacklistedTokenSuggestions)
);
// =============================

app.post("/reprocess-article-stats-events", async (_request, response) => {
  const openedArticles = await infra.db.event.count({
    where: { name: "ARTICLE_OPENED_EVENT" },
  });

  const sentArticles = await infra.db.event.count({
    where: { name: "ARTICLE_PROCESSED_EVENT" },
  });

  const readArticles = await infra.db.event.count({
    where: { name: "ARTICLE_READ_EVENT" },
  });

  const openedArticlesResult = await infra.db.statsKeyValue.upsert({
    where: { key: "openedArticles" },
    update: { value: openedArticles },
    create: { key: "openedArticles", value: openedArticles },
  });

  const readArticlesResult = await infra.db.statsKeyValue.upsert({
    where: { key: "readArticles" },
    update: { value: readArticles },
    create: { key: "readArticles", value: readArticles },
  });

  const sentArticlesResult = await infra.db.statsKeyValue.upsert({
    where: { key: "sentArticles" },
    update: { value: sentArticles },
    create: { key: "sentArticles", value: sentArticles },
  });

  return response.send({
    openedArticlesResult,
    readArticlesResult,
    sentArticlesResult,
  });
});

app.get("*", (_, response) => response.redirect("/"));
app.use(App.Routes.ErrorHandler.handle);

(async function main() {
  await bg.Prerequisites.check(infra.prerequisites);

  const server = app.listen(infra.Env.PORT, async () => {
    infra.logger.info({
      message: "Server has started",
      operation: "server_startup",
      metadata: { port: infra.Env.PORT },
    });
  });

  bg.GracefulShutdown.applyTo(server, () => infra.Scheduler.stop());
})();
