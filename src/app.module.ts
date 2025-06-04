import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

import { validate } from './core/env/env.validator';
import { EnvModule } from './core/env/env.module';
import { LoggerModule } from './core/logger/logger.module';
import { EnvService } from './core/env/env.service';
import { ELogLevel } from './core/logger/logger.interface';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    EnvModule,
    LoggerModule.forRootAsync({
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        dirname: './logs',
        level: 'development' === envService.get('MODE') ? ELogLevel.DEBUG : ELogLevel.ERROR,
        useFile: 'development' !== envService.get('MODE'),
      }),
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule { }
