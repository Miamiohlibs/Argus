import winston from 'winston';
import 'winston-daily-rotate-file';
const { combine, timestamp, json, errors } = winston.format;
import path from 'path';

// const logDirectory = path.join(__dirname);
// console.log('***logdirectory', logDirectory);
// // Ensure the log directory exists (optional, but good practice)
// import fs from 'fs';
// if (!fs.existsSync(logDirectory)) {
//   fs.mkdirSync(logDirectory);
// }

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: 'combined.log',
    }),
    new winston.transports.Console({
      level: 'silly',
    }),
  ],
});

export default logger;
