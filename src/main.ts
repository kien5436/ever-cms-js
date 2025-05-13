import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger, ZodValidationPipe } from 'nestjs-zod';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { EnvService } from './env/env.service';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const { httpAdapter } = app.get(HttpAdapterHost);
  const env = app.get(EnvService);
  const logger = app.get(LoggerService);

  app.useLogger(logger);
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, logger));

  patchNestJsSwagger();

  const config = new DocumentBuilder()
    .setTitle('Cats API')
    .setDescription('API for managing cats')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(env.get('PORT') as number);

  logger.info(`Application is running on ${await app.getUrl()} (${env.get('MODE')})`);
}

bootstrap().catch(console.error);
