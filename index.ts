import express from "express";

import * as bg from "@bgord/node";

import { Home } from "./routes/home";
import { Dashboard } from "./routes/dashboard";

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

app.get("/", bg.CsrfShield.attach, Home);

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

app.get("/dashboard", bg.CsrfShield.attach, AuthShield.verify, Dashboard);

app.get("*", (_request, response) => response.redirect("/"));

const server = app.listen(Env.PORT, () =>
  bg.Reporter.info(`Server running on port: ${Env.PORT}`)
);

bg.GracefulShutdown.applyTo(server);
