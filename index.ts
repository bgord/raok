import express from "express";

import * as bg from "@bgord/node";

import { Home } from "./routes/home";
import { Dashboard } from "./routes/dashboard";
import { AddArticle } from "./routes/add-article";
import { DeleteArticle } from "./routes/delete-article";
import { CreateNewspaper } from "./routes/create-newspaper";
import { ArchiveNewspaper } from "./routes/archive-newspaper";
import { ResendNewspaper } from "./routes/resend-newspaper";
import { Articles } from "./routes/articles";
import { Newspapers } from "./routes/newspapers";
import { SingleNewspaper } from "./routes/single-newspaper";
import { Stats } from "./routes/stats";
import { SendArbitraryFile } from "./routes/send-arbitrary-file";
import { FavouriteArticles } from "./routes/favourite-articles";
import { AddArticleToFavourites } from "./routes/add-article-to-favourites";

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
new bg.Session({ secret: Env.COOKIE_SECRET }).applyTo(app);

AuthShield.applyTo(app);

app.get("/", bg.CsrfShield.attach, bg.Route(Home));

app.get("/articles", AuthShield.verify, bg.Route(Articles));
app.get("/articles/favourite", AuthShield.verify, bg.Route(FavouriteArticles));
app.get("/newspapers", AuthShield.verify, bg.Route(Newspapers));
app.get(
  "/newspaper/:newspaperId",
  AuthShield.verify,
  bg.Route(SingleNewspaper)
);
app.get("/stats", AuthShield.verify, bg.Route(Stats));

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

app.post("/create-newspaper", AuthShield.verify, bg.Route(CreateNewspaper));
app.post(
  "/archive-newspaper/:newspaperId",
  AuthShield.verify,
  bg.Route(ArchiveNewspaper)
);
app.post(
  "/resend-newspaper/:newspaperId",
  AuthShield.verify,
  bg.Route(ResendNewspaper)
);
app.post(
  "/send-arbitrary-file",
  AuthShield.verify,
  ...new bg.FileUploader({ autoClean: false }).handle(),
  bg.Route(SendArbitraryFile)
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

app.get(
  "/dashboard",
  bg.CsrfShield.attach,
  AuthShield.verify,
  bg.Route(Dashboard)
);

app.get("*", (_request, response) => response.redirect("/"));
app.use(ErrorHandler.handle);

const server = app.listen(Env.PORT, () =>
  bg.Reporter.info(`Server running on port: ${Env.PORT}`)
);

bg.GracefulShutdown.applyTo(server, () => {
  bg.Reporter.info("Shutting down job scheduler");
  Scheduler.stop();
});
