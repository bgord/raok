import express from "express";

import * as bg from "@bgord/node";

import { Home } from "./routes/home";

import { Dashboard } from "./routes/dashboard";
import { ArticlesArchive } from "./routes/articles-archive";
import { NewspapersArchive } from "./routes/newspapers-archive";

import { AddArticle } from "./routes/add-article";
import { DeleteArticle } from "./routes/delete-article";
import { CreateNewspaper } from "./routes/create-newspaper";
import { ArchiveNewspaper } from "./routes/archive-newspaper";
import { CancelNewspaper } from "./routes/cancel-newspaper";
import { ResendNewspaper } from "./routes/resend-newspaper";
import { Articles } from "./routes/articles";
import { Newspapers } from "./routes/newspapers";
import { SingleNewspaper } from "./routes/single-newspaper";
import { NewspaperRead } from "./routes/newspaper-read";
import { Stats } from "./routes/stats";
import { SendArbitraryFile } from "./routes/send-arbitrary-file";
import { FavouriteArticles } from "./routes/favourite-articles";
import { AddArticleToFavourites } from "./routes/add-article-to-favourites";
import { DeleteArticleFromFavourites } from "./routes/delete-article-from-favourites";
import { Settings } from "./routes/settings";
import { DisableArticlesToReviewNotification } from "./routes/disable-articles-to-review-notification";
import { EnableArticlesToReviewNotification } from "./routes/enable-articles-to-review-notification";
import { SetArticlesToReviewNotificationHour } from "./routes/set-articles-to-review-notification-hour";
import { ArchiveArticles } from "./routes/archive-articles";
import { ArchiveNewspapers } from "./routes/archive-newspapers";
import { ScheduleFeedlyArticlesCrawl } from "./routes/schedule-feedly-articles-crawl";

import { Scheduler } from "./jobs";
import { ErrorHandler } from "./error-handler";
import { Env } from "./env";

const app = express();

const AuthShield = new bg.EnvUserAuthShield({
  ADMIN_USERNAME: Env.ADMIN_USERNAME,
  ADMIN_PASSWORD: Env.ADMIN_PASSWORD,
});

bg.addExpressEssentials(app, { helmet: { contentSecurityPolicy: false } });

new bg.Handlebars().applyTo(app);

const session = new bg.Session({
  secret: Env.COOKIE_SECRET,
  store: bg.SessionFileStore.build({ ttl: 60 * 60 * 24 * 3 /* 3 days */ }),
});
session.applyTo(app);

AuthShield.applyTo(app);

app.get("/", bg.CsrfShield.attach, bg.Route(Home));

app.get("/articles", AuthShield.verify, bg.Route(Articles));
app.get("/articles/favourite", AuthShield.verify, bg.Route(FavouriteArticles));
app.get("/articles/archive", AuthShield.verify, bg.Route(ArchiveArticles));

app.post("/add-article", AuthShield.verify, bg.Route(AddArticle));
app.post(
  "/delete-article/:articleId",
  AuthShield.verify,
  bg.Route(DeleteArticle)
);
app.post(
  "/article/:articleId/favourite",
  AuthShield.verify,
  bg.Route(AddArticleToFavourites)
);
app.post(
  "/article/:articleId/unfavourite",
  AuthShield.verify,
  bg.Route(DeleteArticleFromFavourites)
);

app.get("/newspapers", AuthShield.verify, bg.Route(Newspapers));
app.get("/newspapers/archive", AuthShield.verify, bg.Route(ArchiveNewspapers));
app.get(
  "/newspaper/:newspaperId",
  AuthShield.verify,
  bg.Route(SingleNewspaper)
);
app.get(
  "/newspaper/:newspaperId/read",
  AuthShield.verify,
  bg.Route(NewspaperRead)
);
app.post("/create-newspaper", AuthShield.verify, bg.Route(CreateNewspaper));
app.post(
  "/archive-newspaper/:newspaperId",
  AuthShield.verify,
  bg.Route(ArchiveNewspaper)
);
app.post(
  "/cancel-newspaper/:newspaperId",
  AuthShield.verify,
  bg.Route(CancelNewspaper)
);
app.post(
  "/resend-newspaper/:newspaperId",
  AuthShield.verify,
  bg.Route(ResendNewspaper)
);

app.post(
  "/send-arbitrary-file",
  AuthShield.verify,
  ...new bg.FileUploader({
    autoClean: false,
    maxFilesSize: 5_000_000, // 5 MB
  }).handle(),
  bg.Route(SendArbitraryFile)
);

app.get("/stats", AuthShield.verify, bg.Route(Stats));
app.get("/settings", AuthShield.verify, bg.Route(Dashboard));
app.get("/account/settings", AuthShield.verify, bg.Route(Settings));

app.post(
  "/disable-articles-to-review-notification",
  AuthShield.verify,
  bg.Route(DisableArticlesToReviewNotification)
);
app.post(
  "/enable-articles-to-review-notification",
  AuthShield.verify,
  bg.Route(EnableArticlesToReviewNotification)
);
app.post(
  "/set-articles-to-review-notification-hour",
  AuthShield.verify,
  bg.Route(SetArticlesToReviewNotificationHour)
);

app.get("/archive/articles", AuthShield.verify, bg.Route(ArticlesArchive));
app.get("/archive/newspapers", AuthShield.verify, bg.Route(NewspapersArchive));

app.post(
  "/schedule-feedly-articles-crawl",
  AuthShield.verify,
  bg.Route(ScheduleFeedlyArticlesCrawl)
);

app.post(
  "/login",
  bg.CsrfShield.verify,
  AuthShield.attach,
  (_request, response) => response.redirect("/dashboard")
);
app.get("/logout", (request, response) => {
  request.logout();
  return response.redirect("/");
});

app.get("/dashboard", AuthShield.verify, bg.Route(Dashboard));

app.get("*", (_request, response) => response.redirect("/"));
app.use(ErrorHandler.handle);

const server = app.listen(Env.PORT, () =>
  bg.Reporter.info(`Server running on port: ${Env.PORT}`)
);

bg.GracefulShutdown.applyTo(server, () => {
  bg.Reporter.info("Shutting down job scheduler");
  Scheduler.stop();
});
