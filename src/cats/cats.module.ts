import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Cat, CatSchema } from './cats.entity';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule { }
