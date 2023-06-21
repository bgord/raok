export * from "./db";
export * from "./env";
export * from "./html";
export * from "./logger";
export * from "./mailer";

import * as bg from "@bgord/node";
import { Env } from "./env";
import { Mailer } from "./mailer";

export const prerequisites = [
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
    mailer: Mailer,
  }),
];

export const Session = new bg.Session({
  secret: Env.COOKIE_SECRET,
  store: bg.SessionFileStore.build({ ttl: bg.Time.Days(3).toSeconds() }),
});

export const AuthShield = new bg.EnvUserAuthShield({
  ADMIN_USERNAME: Env.ADMIN_USERNAME,
  ADMIN_PASSWORD: Env.ADMIN_PASSWORD,
});

export const BasicAuthShield = new bg.BasicAuthShield({
  username: Env.BASIC_AUTH_USERNAME,
  password: Env.BASIC_AUTH_PASSWORD,
});
