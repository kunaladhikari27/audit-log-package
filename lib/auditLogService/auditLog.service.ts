import { createLogger, format, transports, Logger as Iwinston } from "winston";
import { IAuditLogs } from "../interfaces/auditLog.interface";
import { ColorizeOptions } from "logform";
import os from "os";
import "reflect-metadata";
import { injectable } from "inversify";
const { combine, timestamp, metadata, json, errors, label, printf } = format;

@injectable()
export class Logger {
  public logger: Iwinston;

  constructor() {
    this.logger = createLogger(this.readOptions());
  }

  public info(message: string, data?: IAuditLogs): void {
    console.log(data);
    this.logger.info(message, data);
  }

  private readOptions(): Object {
    const logDetails: ColorizeOptions = {
      message: false,
      colors: {
        info: "green",
      },
    };

    function getTimeZone(): string {
      const date = new Date();
      const dateInUtc =
        date.getUTCFullYear().toString() +
        "-" +
        date.getUTCMonth() +
        "-" +
        date.getUTCDate() +
        " " +
        date.getUTCHours() +
        ":" +
        date.getUTCMinutes() +
        ":" +
        date.getUTCSeconds() +
        ":" +
        date.getUTCMilliseconds();
      return dateInUtc;
    }
    const httpService = new transports.Http({
      host: "localhost",
      port: 3000,
      path: "/auditlogs",
    });
    httpService.on("warn", (e) => console.log("warning! " + e));
    return {
      format: combine(
        label({ label: process.env.APP_NAME || "Unknown App" }),
        errors({ stack: true }),
        // Format the metadata object
        format.metadata({
          key: "payload",
          fillExcept: ["message", "level", "timestamp", "label"],
        })
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(logDetails),
            format.printf(
              (info) =>
                `[${getTimeZone()}]:[${os.hostname().toString()}]:[${
                  process.env.APP_NAME || "Unknown App"
                }]:[${process.env.NODE_ENV}]:[${info.level.toUpperCase()}]:[${
                  info.message
                }]`
            )
          ),
        }),
        new transports.File({
          filename: "logs/audit.log",
          format: format.combine(format.json()),
        }),
        httpService,
      ],
    };
  }
}
