const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;
require('winston-daily-rotate-file');
const appRoot = require('app-root-path');

var transport = new transports.DailyRotateFile({
  filename: 'zephyrmusic-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  dirname: `${appRoot}/logs/`,
  level: 'info',
  handleExceptions: true,
  humanReadableUnhandledException: true,
  colorize: true,
  json: false,
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const logger = createLogger({
  transports: [transport],
  exitOnError: false,
  format: combine(timestamp(), prettyPrint()),
});

module.exports = logger;
