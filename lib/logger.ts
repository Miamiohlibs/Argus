import winston from 'winston';
import 'winston-daily-rotate-file';
const { combine, timestamp, json, errors } = winston.format;
import path from 'path';

const logDirectory = path.join(process.cwd(), 'logs');

// Ensure the log directory exists (optional, but good practice)
import fs from 'fs';
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const combinedLogTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDirectory, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  format: combine(errors({ stack: true }), timestamp(), json()),
});

const errorLogTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDirectory, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  format: combine(errors({ stack: true }), timestamp(), json()),
  level: 'error',
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), json()),
  transports: [
    combinedLogTransport,
    errorLogTransport,
    new winston.transports.Console({
      level: 'silly',
    }),
  ],
});

export default logger;
