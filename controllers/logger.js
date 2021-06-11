//https://github.com/winstonjs/winston
//https://nodejs.org/api/http.html#http_http_get_options_callback
//https://sematext.com/blog/node-js-logging/

const _ = require("lodash");
const winston = require("winston");

const options = {
  file: {
    level: "info",
    filename: "/tmp/app.log",
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false,
});

/*
 * Add a request logger method
 */
logger.request = (req) => {
  logger.info(
    "%s request to %s with body %j",
    _.get(req, "method", "UNKNOWN"),
    _.get(req, "url", "UNKNOWN"),
    _.get(req, "body", {})
  );
};

/*
 * Add a request logger method
 */
logger.response = (res, type = "info", data = {}) => {
  logger[type](
    "Responded with %s: %s",
    _.get(res, "statusCode", "UNKNOWN"),
    _.get(res, "statusMessage", "UNKNOWN")
  );
  logger[type](data);
};

module.exports = logger;
