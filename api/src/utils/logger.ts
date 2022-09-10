import winston from "winston";

const isProd = process.env.NODE_ENV === "production";

const getLogLevel = () => {
  if (process.env.LOG_LEVEL) {
    return process.env.LOG_LEVEL;
  }

  return isProd ? "error" : "debug";
};

const logger = (headers: any, userId: string | null, module: string) => {
  const logger = winston.createLogger({
    level: getLogLevel(),
    format: winston.format.json(),
    defaultMeta: { cid: headers.cid, module, userId },
    transports: [new winston.transports.Console({})],
  });

  return logger;
};

export default logger;
