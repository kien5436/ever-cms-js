import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { ZodValidationException } from 'nestjs-zod';

import { ResponseError } from 'src/common/errors';

interface ResponseBody {
  statusCode: number;
  message: string;
  errors?: ResponseError[];
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

  catch(exception: HttpException, host: ArgumentsHost): void {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();
    const statusCode = exception.getStatus();
    const responseBody: ResponseBody = {
      statusCode,
      message: exception.message,
    };

    if (exception instanceof ZodValidationException)
      responseBody.errors = this.formatZodError(exception);

    response.status(statusCode).json(responseBody);
  }

  private formatZodError(ex: ZodValidationException): ResponseError[] {

    return ex.getZodError().issues.map((err) => ({
      code: err.code,
      message: err.message,
      path: err.path,
    }));
  }
}
