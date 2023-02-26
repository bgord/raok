import * as winston from "winston";
import * as bg from "@bgord/node";

import { Env } from "./env";

enum LogLevelTypeEnum {
  error = "error",
  warn = "warn",
  info = "info",
  http = "http",
  verbose = "verbose",
}

type LogTimestampType = number;
type LogAppType = string;
type LogEnvironmentType = string;
type LogMessageType = string;
type LogOperationType = string;
type LogMetadataType = Record<string, any>;

const levels: Record<LogLevelTypeEnum, number> = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
};

type LogFullType = {
  timestamp: LogTimestampType;
  app: LogAppType;
  environment: LogEnvironmentType;
  level: LogLevelTypeEnum;
  message: LogMessageType;
  operation: LogOperationType;
  metadata?: LogMetadataType;
  method: string;
  url: string;
  responseCode?: number;
  client: { ip: string; userAgent?: string };
};

type LogInfoType = Omit<
  LogFullType,
  | "app"
  | "environment"
  | "timestamp"
  | "level"
  | "method"
  | "url"
  | "responseCode"
  | "client"
>;

type LogHttpType = Omit<
  LogFullType,
  "app" | "environment" | "timestamp" | "level"
>;

class Logger {
  instance: winston.Logger;

  app: string;

  environment: string;

  constructor(base: {
    app: string;
    environment: bg.Schema.NodeEnvironmentEnum;
  }) {
    this.app = base.app;
    this.environment = base.environment;

    this.instance = winston.createLogger({
      level: LogLevelTypeEnum.verbose,
      levels,
      format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: `${this.app}-${this.environment}.log`,
          maxsize: 10485760, // 10 MB
        }),
      ],
    });
  }

  private getBase() {
    return {
      app: this.app,
      environment: this.environment,
      timestamp: Date.now(),
    };
  }

  info(log: LogInfoType) {
    this.instance.info({
      level: LogLevelTypeEnum.info,
      ...this.getBase(),
      ...log,
    });
  }

  http(log: LogHttpType) {
    this.instance.http({
      level: LogLevelTypeEnum.http,
      ...this.getBase(),
      ...log,
    });
  }
}

export const logger = new Logger({ app: "raok", environment: Env.type });
