import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  transports: [
      new winston.transports.File({
        level: 'info',
        filename: './logs/all-logs.log',
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),
    new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
    }),
  ],
  exitOnError: false,
});

export class LoggerStream {
  write(text: string) {
    logger.info(text);
  }
}
