import express from "express";

import * as bg from "@bgord/node";

import { Home } from "./routes/home";
import { Dashboard } from "./routes/dashboard";
import { UpdateNumberOfArticlesToAutosend } from "./routes/update-number-of-articles-to-autosend";
import { AddArticle } from "./routes/add-article";
import { DeleteArticle } from "./routes/delete-article";
import { CreateNewspaper } from "./routes/create-newspaper";

import { ErrorHandler } from "./error-handler";
import { Env } from "./env";

const app = express();

const AuthShield = new bg.EnvUserAuthShield({
  ADMIN_USERNAME: Env.ADMIN_USERNAME,
  ADMIN_PASSWORD: Env.ADMIN_PASSWORD,
});

bg.addExpressEssentials(app);
new bg.Handlebars().applyTo(app);
new bg.Session({ secret: Env.COOKIE_SECRET }).applyTo(app);

AuthShield.applyTo(app);

app.get("/", bg.CsrfShield.attach, bg.Route(Home));

app.post(
  "/update-number-of-articles-to-autosend",
  bg.CsrfShield.verify,
  AuthShield.verify,
  bg.Route(UpdateNumberOfArticlesToAutosend)
);
app.post(
  "/add-article",
  bg.CsrfShield.verify,
  AuthShield.verify,
  bg.Route(AddArticle)
);
app.post(
  "/delete-article/:articleId",
  bg.CsrfShield.verify,
  AuthShield.verify,
  bg.Route(DeleteArticle)
);
app.post(
  "/create-newspaper",
  bg.CsrfShield.verify,
  AuthShield.verify,
  bg.Route(CreateNewspaper)
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

bg.GracefulShutdown.applyTo(server);
