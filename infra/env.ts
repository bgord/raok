import * as bg from "@bgord/node";
import { z } from "zod";

const EnvironmentSchema = z
  .object({
    PORT: bg.Schema.Port,
    ADMIN_USERNAME: z.string().email(),
    ADMIN_PASSWORD: bg.Schema.AdminPassword,
    SMTP_HOST: bg.Schema.SmtpHost,
    SMTP_PORT: bg.Schema.SmtpPort,
    SMTP_USER: bg.Schema.SmtpUser,
    SMTP_PASS: bg.Schema.SmtpPass,
    EMAIL_FROM: bg.Schema.Email,
    LOGS_LEVEL: bg.Schema.LogLevel,
    BASIC_AUTH_USERNAME: bg.Schema.BasicAuthUsername,
    BASIC_AUTH_PASSWORD: bg.Schema.BasicAuthPassword,
    RSS_CRAWLING_ENABLED: bg.Schema.FeatureFlag,
    HCAPTCHA_SECRET_KEY: bg.Schema.HCaptchaSecretKey,
    HCAPTCHA_SITE_KEY: bg.Schema.HCaptchaSiteKey,
    TZ: bg.Schema.TimezoneUTC,
  })
  .strip();

export const Env = new bg.EnvironmentValidator<
  z.infer<typeof EnvironmentSchema>
>({
  type: process.env.NODE_ENV,
  schema: EnvironmentSchema,
}).load();
