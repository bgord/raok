import { z } from "zod";
import { Schema, EnvironmentValidator } from "@bgord/node";

const EnvironmentSchema = z.object({
  PORT: Schema.Port,
  ADMIN_USERNAME: Schema.AdminUsername,
  ADMIN_PASSWORD: Schema.AdminPassword,
  COOKIE_SECRET: Schema.CookieSecret,
  SMTP_HOST: Schema.SmtpHost,
  SMTP_PORT: Schema.SmtpPort,
  SMTP_USER: Schema.SmtpUser,
  SMTP_PASS: Schema.SmtpPass,
  EMAIL_FROM: Schema.Email,
  EMAIL_TO_DELIVER_TO: Schema.Email,
  EMAIL_FOR_NOTIFICATIONS: Schema.Email,
  FEEDLY_TOKEN: z.string().trim().min(1),
  FEEDLY_STREAM_ID: z.string().trim().min(1),
  SUPRESS_FEEDLY_CRAWLING: Schema.FeatureFlag,
});
type EnvironmentSchemaType = z.infer<typeof EnvironmentSchema>;

export const Env = new EnvironmentValidator<EnvironmentSchemaType>({
  type: process.env.NODE_ENV,
  schema: EnvironmentSchema,
}).load();
