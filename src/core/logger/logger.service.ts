import { Inject, Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';
import 'winston-daily-rotate-file';

import { ELogLevel, LOGGER_OPTIONS, LoggerOptions } from './logger.interface';
import stringify from 'src/common/stringify';

@Injectable()
export class LoggerService implements NestLoggerService {

  private logger: Logger;

  constructor(@Inject(LOGGER_OPTIONS) options: LoggerOptions) {

    this.logger = createLogger({ level: options.level || ELogLevel.DEBUG });

    if (options.useFile)
      this.logger.add(new transports.DailyRotateFile({
        dirname: options.dirname || './logs',
        filename: 'application-%DATE%.log',
        maxSize: options.maxFileSize || '20m',
        maxFiles: options.maxFiles || '14d',
        format: this.getFileFormat(),
      }));
    else
      this.logger.add(new transports.Console({
        handleExceptions: true,
        handleRejections: true,
        format: this.getConsoleFormat(),
      }));
  }

  private getConsoleFormat() {

    return format.combine(
      this.suppressStartupLogs(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      format.ms(),
      format.colorize(),
      format.printf((info) => {

        const message = stringify(...info.message as unknown[]);

        return `${info.timestamp as string} - ${info.level}: [${info.context as string}] ${message} ${info.ms as string}`;
      }),
    );
  }

  private getFileFormat() {

    return format.combine(
      this.suppressStartupLogs(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      format.ms(),
      format.json(),
    );
  }

  private suppressStartupLogs() {

    return format((info) => {

      if (info.context && 'Logger' === info.context) return false;

      return info;
    })();
  }

  log(...message: unknown[]) { this.logger.verbose({ message, context: this.detectContext() }) }

  error(...message: unknown[]) { this.logger.error({ message, context: this.detectContext() }) }

  warn(...message: unknown[]) { this.logger.warn({ message, context: this.detectContext() }) }

  debug(...message: unknown[]) { this.logger.debug({ message, context: this.detectContext() }) }

  verbose(...message: unknown[]) { this.logger.verbose({ message, context: this.detectContext() }) }

  info(...message: unknown[]) { this.logger.info({ message, context: this.detectContext() }) }

  private detectContext(): string {

    const stackLines = new Error().stack?.split('\n').slice(3) || [];
    const callerLine = stackLines.find((line) => !line.includes('logger.service.ts'));

    if (!callerLine) return 'Unknown';

    // Try to extract class name from caller
    const classMatch = callerLine.match(/at (\w+)\./);

    if (classMatch && classMatch[1])
      return classMatch[1];

    // Try to extract file name if class name not found
    const fileMatch = callerLine.match(/at .+\/([^/]+)\.[jt]s/);

    if (fileMatch && fileMatch[1])
      return fileMatch[1];

    return 'App';
  }

  getContext(): string { return this.detectContext() }
}
