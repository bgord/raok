export * from "./db";
export * from "./env";
export * from "./html";
export * from "./logger";
export * from "./response-cache";
export * from "./mailer";
export * from "./supported-languages";

import * as bg from "@bgord/node";
import { ResponseCache } from "./response-cache";
import { Env } from "./env";
import { Mailer } from "./mailer";
import { SupportedLanguages } from "./supported-languages";

export const prerequisites = [
  new bg.PrerequisitePort({ label: "port", port: Env.PORT }),
  new bg.PrerequisiteBinary({
    label: "pandoc",
    binary: "pandoc",
    enabled: Env.type !== bg.Schema.NodeEnvironmentEnum.test,
  }),
  new bg.PrerequisiteBinary({
    label: "calibre",
    binary: "ebook-convert",
    enabled: Env.type !== bg.Schema.NodeEnvironmentEnum.test,
  }),
  new bg.PrerequisitePath({
    label: "static directory",
    path: "static",
    access: { write: true },
  }),
  new bg.PrerequisitePath({
    label: "newspapers directory",
    path: "newspapers",
    access: { write: true },
  }),
  new bg.PrerequisiteNode({
    label: "node",
    version: bg.PackageVersion.fromStringWithV("v22.6.0"),
  }),
  new bg.PrerequisiteRAM({
    label: "RAM",
    enabled: Env.type !== bg.Schema.NodeEnvironmentEnum.local,
    minimum: new bg.Size({ unit: bg.SizeUnit.MB, value: 128 }),
  }),
  new bg.PrerequisiteSpace({
    label: "disk space",
    minimum: new bg.Size({ unit: bg.SizeUnit.MB, value: 512 }),
  }),
  new bg.PrerequisiteTranslations({
    label: "translations",
    supportedLanguages: SupportedLanguages,
  }),
  new bg.PrerequisiteMemory({
    label: "memory-consumption",
    maximum: new bg.Size({ value: 500, unit: bg.SizeUnit.MB }),
  }),
];

export const healthcheck = [
  new bg.PrerequisiteSelf({ label: "api" }),
  new bg.PrerequisiteOutsideConnectivity({ label: "outside-connectivity" }),
  new bg.PrerequisiteSSLCertificateExpiry({
    label: "ssl-certificate-expiry",
    host: "raok.bgord.me",
    validDaysMinimum: 7,
  }),
  new bg.PrerequisiteMailer({ label: "nodemailer", mailer: Mailer }),
  ...prerequisites.filter(
    (prerequisite) => prerequisite.config.label !== "port",
  ),
];

export const BasicAuthShield = new bg.BasicAuthShield({
  username: Env.BASIC_AUTH_USERNAME,
  password: Env.BASIC_AUTH_PASSWORD,
});

export { EventStore } from "./event-store";
export * from "./jobs";

export const CacheResponse = new bg.CacheResponse(ResponseCache);

export * from "./lucia";

/** @public */
export const hCaptchaShield = new bg.HCaptchaShield({
  mode:
    Env.type === bg.Schema.NodeEnvironmentEnum.production
      ? bg.Schema.NodeEnvironmentEnum.production
      : bg.Schema.NodeEnvironmentEnum.local,
  secretKey: Env.HCAPTCHA_SECRET_KEY,
});
