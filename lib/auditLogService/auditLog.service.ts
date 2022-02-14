import { createLogger, format, transports, Logger as Iwinston } from "winston";
import { IAuditLogs } from "../interfaces/auditLog.interface";
import { ColorizeOptions } from "logform";

export class Logger {
  public logger: any;

  constructor() {
    this.logger = createLogger(this.readOptions());
  }

  public info(payload: IAuditLogs): IAuditLogs {
    return this.logger.info(payload);
  }

  private getTimeZone(): string {
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

  private readOptions(): Object {
    const httpService = new transports.Http({
      host: "localhost",
      port: 3000,
      path: "/auditlogs",
    });
    httpService.on("warn", (e) => console.log("warning! " + e));
    return {
      format: format.combine(
        format.label({ label: process.env.APP_NAME || "Unknown App" }),
        format.timestamp({ format: this.getTimeZone() })
        // Format the metadata object
        // format.metadata({
        //   fillExcept: ["message", "level", "timestamp", "label"],
        // })
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
