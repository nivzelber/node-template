import { createLogger, format, transports } from "winston";

const errorPrinter = format(info => {
  const splatSymbol: any = Object.getOwnPropertySymbols(info).find(symbol => {
    symbol.toString().includes("splat");
  });
  const error = info[splatSymbol]?.filter(i => i instanceof Error)?.[0];

  if (error) {
    info = {
      ...info,
      error: error.stack
    };
  }

  return info;
});

const consoleTransport = new transports.Console({
  level: "debug",
  format: format.combine(
    format.printf(
      info =>
        `${info.timestamp} [${info.level.toUpperCase()}] ${info.message} ${
          info.error ? `\n${info.error}` : ""
        }`
    ),
    format.colorize({ all: true })
  )
});

export const logger = createLogger({
  format: format.combine(format.timestamp(), errorPrinter(), format.json()),
  transports: [consoleTransport]
});
