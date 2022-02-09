import { Logger, createLogger, transports, format, http } from "winston";
import os from "os";
import { ColorizeOptions } from "logform";
const path = require("path");
import { IAuditLogs, ISystemDetails } from "./../interfaces/auditLog.interface";
// var winston = require("winston");
// require("winston-kafka-connect");

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

export function getLogger(systemDetails: ISystemDetails): Logger {
  return createLogger({
    format: format.combine(
      format.label({ label: path.basename(process.mainModule.filename) }),
      format.timestamp({ format: getTimeZone() }),
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
              `[${getTimeZone()}]:[${os
                .hostname()
                .toString()}]:[${systemDetails.application_name.toString()}]:[${
                systemDetails.build_version
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
    exitOnError: false,
  });
}
