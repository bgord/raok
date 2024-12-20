import express from "express";
import * as bg from "@bgord/node";

import * as App from "./app";

import * as RSS from "./modules/rss";
import * as Stats from "./modules/stats";
import * as Delivery from "./modules/delivery";
import * as Newspapers from "./modules/newspapers";
import * as Recommendations from "./modules/recommendations";

import * as infra from "./infra";

const app = express();

bg.addExpressEssentials(app);
bg.Handlebars.applyTo(app);
infra.AuthShield.applyTo(app);
bg.I18n.applyTo(app, { supportedLanguages: infra.SupportedLanguages });
bg.HttpLogger.applyTo(app, infra.logger);

// Auth ========================
app.get("/", App.Routes.Home);
app.post(
  "/login",
  // infra.hCaptchaShield.verify,
  infra.AuthShield.reverse,
  infra.AuthShield.attach,
  bg.Redirector.build("/dashboard")
);
app.get("/logout", infra.AuthShield.detach, bg.Redirector.build("/"));

app.get(
  "/dashboard",
  infra.AuthShield.verify,
  bg.CacheStaticFiles.handle(bg.CacheStaticFilesStrategy.never),
  App.Routes.Dashboard
);

// =============================

// Articles ====================
app.get("/articles", infra.AuthShield.verify, Newspapers.Routes.Articles);
app.get(
  "/articles/search",
  infra.AuthShield.verify,
  Newspapers.Routes.ArticlesSearch
);
app.get(
  "/articles/archive",
  infra.AuthShield.verify,
  Newspapers.Routes.ArchiveArticles
);
app.post("/add-article", infra.AuthShield.verify, Newspapers.Routes.AddArticle);
app.post(
  "/delete-article/:articleId",
  infra.AuthShield.verify,
  Newspapers.Routes.DeleteArticle
);
app.post(
  "/undelete-article/:articleId",
  infra.AuthShield.verify,
  Newspapers.Routes.UndeleteArticle
);
app.post(
  "/article/:articleId/mark-as-read",
  infra.AuthShield.verify,
  Newspapers.Routes.ArticleMarkAsRead
);
app.post(
  "/article/:articleId/opened",
  infra.AuthShield.verify,
  Newspapers.Routes.ArticleOpened
);
app.post(
  "/article/:articleId/homepage-opened",
  infra.AuthShield.verify,
  Newspapers.Routes.ArticleHomepageOpened
);
app.get(
  "/archive/articles",
  infra.AuthShield.verify,
  Newspapers.Routes.ArticlesArchive
);
// =============================

// Newspapers ==================
app.get("/newspapers", infra.AuthShield.verify, Newspapers.Routes.Newspapers);
app.get(
  "/newspaper/:newspaperId",
  infra.AuthShield.verify,
  Newspapers.Routes.SingleNewspaper
);
app.post(
  "/create-newspaper",
  infra.AuthShield.verify,
  Newspapers.Routes.CreateNewspaper
);
app.post(
  "/archive-newspaper/:newspaperId",
  infra.AuthShield.verify,
  Newspapers.Routes.ArchiveNewspaper
);
app.post(
  "/cancel-newspaper/:newspaperId",
  infra.AuthShield.verify,
  Newspapers.Routes.CancelNewspaper
);
app.post(
  "/resend-newspaper/:newspaperId",
  infra.AuthShield.verify,
  Newspapers.Routes.ResendNewspaper
);
// =============================

// Files =======================
app.post(
  "/send-arbitrary-file",
  infra.AuthShield.verify,
  ...bg.FileUploader.handle({
    autoClean: false,
    maxFilesSize: Delivery.VO.MAX_UPLOADED_FILE_SIZE_BYTES,
    uploadDir: "files",
    mimeTypes: Delivery.VO.FileMimeTypes.value,
  }),
  Delivery.Routes.SendArbitraryFile
);
// =============================

// Stats =======================
app.get("/stats", infra.AuthShield.verify, Stats.Routes.Stats);
// =============================

// Settings ====================
app.get("/settings", infra.AuthShield.verify, App.Routes.Dashboard);
// =============================

// Source ======================
app.get("/sources", infra.AuthShield.verify, RSS.Routes.Sources);
app.post(
  "/rss/source/create",
  infra.AuthShield.verify,
  infra.CacheResponse.clear,
  RSS.Routes.SourceCreate
);
app.delete(
  "/rss/source/:sourceId",
  infra.AuthShield.verify,
  infra.CacheResponse.clear,
  RSS.Routes.SourceDelete
);
app.get(
  "/rss/source/list",
  infra.AuthShield.verify,
  infra.CacheResponse.handle,
  RSS.Routes.SourceList
);
app.get(
  "/rss/source/:sourceId/preview",
  infra.AuthShield.verify,
  infra.CacheResponse.handle,
  RSS.Routes.SourcePreview
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

// Recommendations =============
app.get(
  "/token-blacklist",
  infra.AuthShield.verify,
  infra.CacheResponse.handle,
  Recommendations.Routes.TokenBlacklist
);

app.post(
  "/token-blacklist/create",
  infra.AuthShield.verify,
  infra.CacheResponse.clear,
  Recommendations.Routes.BlacklistedTokenCreate
);

app.post(
  "/token-blacklist/delete",
  infra.AuthShield.verify,
  infra.CacheResponse.clear,
  Recommendations.Routes.BlacklistedTokenDelete
);

app.get(
  "/token-blacklist/suggestions",
  infra.AuthShield.verify,
  infra.CacheResponse.handle,
  Recommendations.Routes.BlacklistedTokenSuggestions
);

app.delete(
  "/token-blacklist/suggestions/dismiss",
  infra.AuthShield.verify,
  infra.CacheResponse.clear,
  Recommendations.Routes.SuggestedBlacklistedTokenDismiss
);
// =============================

// Devices =====================
app.get(
  "/device/list",
  infra.AuthShield.verify,
  infra.CacheResponse.handle,
  Delivery.Routes.DeviceList
);

app.post(
  "/device/create",
  infra.AuthShield.verify,
  infra.CacheResponse.clear,
  Delivery.Routes.DeviceCreate
);

app.post(
  "/device/:id/delete",
  infra.AuthShield.verify,
  infra.CacheResponse.clear,
  Delivery.Routes.DeviceDelete
);
// =============================

app.get(".*catchall", bg.Redirector.build("/"));
app.use(App.Routes.ErrorHandler.handle);

(async function main() {
  await bg.Prerequisites.check(infra.prerequisites);
  await App.Services.AdminUserCreator.create();

  const server = app.listen(infra.Env.PORT, async () => {
    infra.logger.info({
      message: "Server has started",
      operation: "server_startup",
      metadata: {
        port: infra.Env.PORT,
        startupTimeMs: app.locals.startup.stop().durationMs,
      },
    });
    await Recommendations.Services.StopWordsCleaner.run();
  });

  bg.GracefulShutdown.applyTo(server, () => infra.Scheduler.stop());
})();
