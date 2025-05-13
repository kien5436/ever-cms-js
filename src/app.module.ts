import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { CatsModule } from './cats/cats.module';
import { validate } from './env/env.validator';
import { EnvModule } from './env/env.module';
import { EnvService } from './env/env.service';
import { LoggerModule } from './logger/logger.module';
import { ELogLevel } from './logger/logger.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
    }),
    // LoggerModule.forRootAsync({
    //   imports: [EnvModule],
    //   inject: [EnvService],
    //   useFactory: (envService: EnvService) => ({
    //     dirname: './logs',
    //     level: 'development' === envService.get('MODE') ? ELogLevel.DEBUG : ELogLevel.ERROR,
    //     useFile: 'development' !== envService.get('MODE'),
    //   }),
    // }),
    LoggerModule.forRoot({ level: ELogLevel.DEBUG }),
    MongooseModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({ uri: envService.get('MONGO_CONNECTION_STRING') }),
    }),
    CatsModule,
  ],
})
export class AppModule { }
