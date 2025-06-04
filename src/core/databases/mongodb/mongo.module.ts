import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { EnvService } from 'src/core/env/env.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [EnvService],
      useFactory(envService: EnvService) {

        const isDev = 'development' === envService.get('MODE');

        mongoose.set('debug', isDev);

        return {
          uri: envService.get('MONGO_CONNECTION_STRING'),
          user: envService.get('MONGO_INITDB_ROOT_USERNAME'),
          pass: envService.get('MONGO_INITDB_ROOT_PASSWORD'),
          dbName: envService.get('MONGO_INITDB_DATABASE'),
          autoIndex: isDev,
        };
      },
    }),
  ],
})
export class MongoModule { }
