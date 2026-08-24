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
  format: combine(timestamp(), winston.format.simple()),
  transports: [
    combinedLogTransport,
    errorLogTransport,
    new winston.transports.Console({
      level: 'silly',
    }),
  ],
});

// Returns the file/line/function of whoever called `referenceFunction`'s caller,
// so debug/error logs can be traced back to their call site.
function getCallsite(referenceFunction: (...args: never[]) => unknown) {
  const originalPrepareStackTrace = Error.prepareStackTrace;
  try {
    Error.prepareStackTrace = (_error, stack) => stack;
    const target: { stack?: NodeJS.CallSite[] } = {};
    Error.captureStackTrace(target, referenceFunction);
    const frame = target.stack?.[0];
    if (!frame) return {};
    return {
      callsite: {
        file: path.relative(process.cwd(), frame.getFileName() ?? ''),
        line: frame.getLineNumber(),
        function: frame.getFunctionName() ?? undefined,
      },
    };
  } catch {
    return {};
  } finally {
    Error.prepareStackTrace = originalPrepareStackTrace;
  }
}

function withCallsite(original: (...args: any[]) => winston.Logger) {
  function wrapped(...args: any[]) {
    const child = logger.child(getCallsite(wrapped));
    return original.apply(child, args);
  }
  return wrapped;
}

// Capture the prototype-inherited methods before shadowing them below, since
// they need to run with `this` set to the per-call child logger, not `logger`.
logger.debug = withCallsite(logger.debug);
logger.error = withCallsite(logger.error);

export default logger;
