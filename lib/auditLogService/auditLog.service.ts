import { Logger, createLogger, transports, format } from "winston";
import os from "os";
import { ColorizeOptions } from "logform";
import { ISystemDetails } from "lib/interfaces/auditLog.interface";

const logDetails: ColorizeOptions = {
  message: true,
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
    "-" +
    date.getUTCHours() +
    "-" +
    date.getUTCMinutes() +
    "-" +
    date.getUTCSeconds() +
    "-" +
    date.getUTCMilliseconds();
  return dateInUtc;
}

export function logger(systemDetails: ISystemDetails): Logger {
  return createLogger({
    transports: [
      new transports.Console({
        level: "info",
        handleExceptions: false,
        format: format.combine(
          format.colorize(logDetails),
          format.timestamp(),
          format.simple(),
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
        level: "info",
        handleExceptions: false,
        format: format.combine(
          format.timestamp(),
          format.ms(),
          format.json(),
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
    ],
  });
}
