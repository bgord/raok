import express from "express";

import * as bg from "@bgord/node";

import { Env } from "./env";

const app = express();

bg.addExpressEssentials(app);
new bg.Handlebars().applyTo(app);

app.get("/", (_request, response) => response.render("home"));

const server = app.listen(Env.PORT, () =>
  bg.Reporter.info(`Server running on port: ${Env.PORT}`)
);

bg.GracefulShutdown.applyTo(server);
