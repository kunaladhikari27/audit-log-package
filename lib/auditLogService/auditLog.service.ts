import { createLogger, format, transports, Logger as Iwinston } from "winston";
import { IAuditLogs } from "../interfaces/auditLog.interface";
import { ColorizeOptions } from "logform";
import os from "os";
import "reflect-metadata";
import { injectable } from "inversify";

@injectable()
export class Logger {
  public logger: Iwinston;

  constructor() {
    this.logger = createLogger(this.readOptions());
  }

  public info(payload: IAuditLogs): void {
    this.logger.info(payload);
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
      format: format.combine(
        format.label({ label: process.env.APP_NAME || "Unknown App" }),
        format.timestamp({ format: getTimeZone() }),
        // Format the metadata object
        format.metadata({
          fillExcept: ["message", "level", "timestamp", "label"],
        })
      ),
      transports: [
        new transports.File({
          filename: "logs/audit.log",
          format: format.combine(format.json()),
        }),
        httpService,
      ],
      exitOnError: false,
    };
  }
}
