export * from "./db";
export * from "./env";
export * from "./html";
export * from "./logger";
export * from "./mailer";

import * as bg from "@bgord/node";
import { db } from "./db";
import { Env } from "./env";
import { Mailer } from "./mailer";

export const prerequisites = [
  new bg.Prerequisite({
    label: "pandoc",
    binary: "pandoc",
    strategy: bg.PrerequisiteStrategyEnum.binary,
  }),

  new bg.Prerequisite({
    label: "calibre",
    binary: "ebook-convert",
    strategy: bg.PrerequisiteStrategyEnum.binary,
  }),

  new bg.Prerequisite({
    label: "nodemailer",
    strategy: bg.PrerequisiteStrategyEnum.mailer,
    mailer: Mailer,
  }),

  new bg.Prerequisite({
    label: "prisma-sqlite",
    strategy: bg.PrerequisiteStrategyEnum.prisma,
    client: db,
  }),

  new bg.Prerequisite({
    label: "static directory",
    strategy: bg.PrerequisiteStrategyEnum.path,
    path: "static",
    access: { write: true },
  }),

  new bg.Prerequisite({
    label: "files directory",
    strategy: bg.PrerequisiteStrategyEnum.path,
    path: "files",
    access: { write: true },
  }),

  new bg.Prerequisite({
    label: "newspapers directory",
    strategy: bg.PrerequisiteStrategyEnum.path,
    path: "newspapers",
    access: { write: true },
  }),

  new bg.Prerequisite({
    label: "node",
    strategy: bg.PrerequisiteStrategyEnum.node,
    version: bg.PackageVersion.fromStringWithV("v14.0.0"),
  }),

  new bg.Prerequisite({
    label: "RAM",
    strategy: bg.PrerequisiteStrategyEnum.RAM,
    minimum: new bg.Size({ unit: bg.SizeUnit.MB, value: 100 }),
  }),
];

export const Session = new bg.Session({
  secret: Env.COOKIE_SECRET,
  store: bg.SessionFileStore.build({ ttl: bg.Time.Days(3).seconds }),
});

export const AuthShield = new bg.EnvUserAuthShield({
  ADMIN_USERNAME: Env.ADMIN_USERNAME,
  ADMIN_PASSWORD: Env.ADMIN_PASSWORD,
});

export const BasicAuthShield = new bg.BasicAuthShield({
  username: Env.BASIC_AUTH_USERNAME,
  password: Env.BASIC_AUTH_PASSWORD,
});
