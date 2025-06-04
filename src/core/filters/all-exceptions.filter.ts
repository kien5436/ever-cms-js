import { ArgumentsHost, Catch, HttpServer, LoggerService } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {

  constructor(
    appRef: HttpServer,
    private readonly logger: LoggerService,
  ) { super(appRef) }

  catch(exception: unknown, host: ArgumentsHost) {

    super.catch(exception, host);

    this.logger.error(exception);
  }
}
