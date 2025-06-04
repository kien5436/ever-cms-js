import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';

import { AppModule } from './app.module';
import { EnvService } from './core/env/env.service';
import { LoggerService } from './core/logger/logger.service';
import { AllExceptionsFilter } from './core/filters/all-exceptions.filter';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const env = app.get(EnvService);
  const logger = app.get(LoggerService);
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useLogger(logger);
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapter, logger),
    new HttpExceptionFilter(),
  );
  app.enableCors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  });
  app.use(cookieParser(env.get('COOKIE_SECRET')));
  app.use(helmet());

  if ('production' !== env.get('MODE')) {

    patchNestJsSwagger();

    const config = new DocumentBuilder()
      .setTitle('API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document);
  }

  await app.listen(env.get('PORT')!);

  logger.info(`Application is running on ${await app.getUrl()} (${env.get('MODE')})`);
}

bootstrap().catch(console.error);
