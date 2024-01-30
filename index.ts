import express from "express";
import * as bg from "@bgord/node";

import * as Auth from "./auth";
import * as App from "./app";

import * as RSS from "./modules/rss";
import * as Settings from "./modules/settings";
import * as Stats from "./modules/stats";
import * as Files from "./modules/files";
import * as Newspapers from "./modules/newspapers";
import * as Reordering from "./modules/reordering";
import * as Recommendations from "./modules/recommendations";

import * as infra from "./infra";

const AuthShield = new Auth.AuthShield<infra.User>({
  Username: Auth.Username,
  Password: Auth.Password,
  HashedPassword: Auth.HashedPassword,
  lucia: infra.lucia,
  findUniqueUserOrThrow: (username: Auth.Username) =>
    infra.db.user.findUniqueOrThrow({
      where: { email: username.read() },
    }),
});

const app = express();

bg.addExpressEssentials(app);
bg.Handlebars.applyTo(app);
AuthShield.applyTo(app);
bg.I18n.applyTo(app, { supportedLanguages: infra.SupportedLanguages });
bg.HttpLogger.applyTo(app, infra.logger);

// Auth ========================
app.get("/", bg.Route(App.Routes.Home));
app.post(
  "/login",
  // bg.CsrfShield.verify,
  AuthShield.reverse,
  AuthShield.attach,
  (_request, response) => response.redirect("/dashboard")
);
app.get("/logout", AuthShield.detach, (_, response) => response.redirect("/"));

app.get(
  "/dashboard",
  AuthShield.verify,
  bg.CacheStaticFiles.handle(bg.CacheStaticFilesStrategy.never),
  bg.Route(App.Routes.Dashboard)
);

// =============================

// Articles ====================
app.get("/articles", AuthShield.verify, bg.Route(Newspapers.Routes.Articles));
app.get(
  "/articles/search",
  AuthShield.verify,
  bg.Route(Newspapers.Routes.ArticlesSearch)
);
app.get(
  "/articles/archive",
  AuthShield.verify,
  bg.Route(Newspapers.Routes.ArchiveArticles)
);
app.post(
  "/add-article",
  AuthShield.verify,
  bg.Route(Newspapers.Routes.AddArticle)
);
app.post(
  "/delete-article/:articleId",
  AuthShield.verify,
  bg.Route(Newspapers.Routes.DeleteArticle)
);
app.post(
  "/undelete-article/:articleId",
  AuthShield.verify,
  bg.Route(Newspapers.Routes.UndeleteArticle)
);
app.post(
  "/article/:articleId/mark-as-read",
  AuthShield.verify,
  bg.Route(Newspapers.Routes.ArticleMarkAsRead)
);
app.post(
  "/article/:articleId/deliver-by-email",
  AuthShield.verify,
  bg.Route(Newspapers.Routes.ArticleDeliverByEmail)
);
app.post(
  "/article/:articleId/opened",
  AuthShield.verify,
  bg.Route(Newspapers.Routes.ArticleOpened)
);
app.get(
  "/archive/articles",
  AuthShield.verify,
  bg.Route(Newspapers.Routes.ArticlesArchive)
);
// =============================

// Newspapers ==================
app.get(
  "/newspapers",
  AuthShield.verify,
  bg.Route(Newspapers.Routes.Newspapers)
);
app.get(
  "/newspaper/:newspaperId",
  AuthShield.verify,
  bg.Route(Newspapers.Routes.SingleNewspaper)
);
app.get(
  "/newspaper/:newspaperId/read",
  AuthShield.verify,
  bg.Route(Newspapers.Routes.NewspaperRead)
);
app.post(
  "/create-newspaper",
  AuthShield.verify,
  bg.Route(Newspapers.Routes.CreateNewspaper)
);
app.post(
  "/archive-newspaper/:newspaperId",
  AuthShield.verify,
  bg.Route(Newspapers.Routes.ArchiveNewspaper)
);
app.post(
  "/cancel-newspaper/:newspaperId",
  AuthShield.verify,
  bg.Route(Newspapers.Routes.CancelNewspaper)
);
app.post(
  "/resend-newspaper/:newspaperId",
  AuthShield.verify,
  bg.Route(Newspapers.Routes.ResendNewspaper)
);
// =============================

// Files =======================
app.post(
  "/send-arbitrary-file",
  AuthShield.verify,
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
  AuthShield.verify,
  bg.Route(Files.Routes.DownloadFile)
);
app.get(
  "/files/archive",
  AuthShield.verify,
  bg.Route(Files.Routes.ArchiveFiles)
);
app.get(
  "/archive/files",
  AuthShield.verify,
  bg.Route(Files.Routes.FilesArchive)
);
// =============================

// Stats =======================
app.get("/stats", AuthShield.verify, bg.Route(Stats.Routes.Stats));
// =============================

// Settings ====================
app.get("/settings", AuthShield.verify, bg.Route(App.Routes.Dashboard));
app.get(
  "/account/settings",
  AuthShield.verify,
  bg.Route(Settings.Routes.Settings)
);
app.post(
  "/disable-articles-to-review-notification",
  AuthShield.verify,
  bg.Route(Settings.Routes.DisableArticlesToReviewNotification)
);
app.post(
  "/enable-articles-to-review-notification",
  AuthShield.verify,
  bg.Route(Settings.Routes.EnableArticlesToReviewNotification)
);
app.post(
  "/set-articles-to-review-notification-hour",
  AuthShield.verify,
  bg.Route(Settings.Routes.SetArticlesToReviewNotificationHour)
);
// =============================

// Source ======================
app.get("/sources", AuthShield.verify, bg.Route(RSS.Routes.Sources));
app.post(
  "/rss/source/create",
  AuthShield.verify,
  infra.CacheResponse.clear,
  bg.Route(RSS.Routes.SourceCreate)
);
app.delete(
  "/rss/source/:sourceId",
  AuthShield.verify,
  infra.CacheResponse.clear,
  bg.Route(RSS.Routes.SourceDelete)
);
app.post(
  "/rss/source/:sourceId/archive",
  AuthShield.verify,
  infra.CacheResponse.clear,
  bg.Route(RSS.Routes.SourceArchive)
);
app.post(
  "/rss/source/:sourceId/reactivate",
  AuthShield.verify,
  infra.CacheResponse.clear,
  bg.Route(RSS.Routes.SourceReactivate)
);
app.get(
  "/rss/source/list",
  AuthShield.verify,
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
  AuthShield.verify,
  infra.CacheResponse.clear,
  bg.Route(Reordering.Routes.ReorderingTransfer)
);
// =============================

// Recommendations =============
app.get(
  "/token-blacklist",
  AuthShield.verify,
  infra.CacheResponse.handle,
  bg.Route(Recommendations.Routes.TokenBlacklist)
);

app.post(
  "/token-blacklist/create",
  AuthShield.verify,
  infra.CacheResponse.clear,
  bg.Route(Recommendations.Routes.BlacklistedTokenCreate)
);

app.post(
  "/token-blacklist/delete",
  AuthShield.verify,
  infra.CacheResponse.clear,
  bg.Route(Recommendations.Routes.BlacklistedTokenDelete)
);

app.get(
  "/token-blacklist/suggestions",
  AuthShield.verify,
  infra.CacheResponse.handle,
  bg.Route(Recommendations.Routes.BlacklistedTokenSuggestions)
);

app.delete(
  "/token-blacklist/suggestions/dismiss",
  AuthShield.verify,
  infra.CacheResponse.clear,
  bg.Route(Recommendations.Routes.SuggestedBlacklistedTokenDismiss)
);
// =============================

app.get("*", (_, response) => response.redirect("/"));
app.use(App.Routes.ErrorHandler.handle);

(async function main() {
  await bg.Prerequisites.check(infra.prerequisites);
  await App.Services.AdminUserCreator.create();

  const server = app.listen(infra.Env.PORT, async () => {
    infra.logger.info({
      message: "Server has started",
      operation: "server_startup",
      metadata: { port: infra.Env.PORT },
    });
    await Recommendations.Services.StopWordsCleaner.run();
  });

  bg.GracefulShutdown.applyTo(server, () => infra.Scheduler.stop());
})();
