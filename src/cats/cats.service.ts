import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Cat } from './cats.entity';
import { CreateCatDto } from './dtos/create-cat.dto';
import { UpdateCatDto } from './dtos/update-cat.dto';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CatsService {

  constructor(@InjectModel(Cat.name) private catModel: Model<Cat>, private readonly logger: LoggerService) { }

  create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto);

    return createdCat.save();
  }

  findAll(): Promise<Cat[]> {

    this.logger.debug('get all cats');

    return this.catModel.find().exec();
  }

  findOne(id: string): Promise<Cat | null> {
    return this.catModel.findById(id).exec();
  }

  async update(id: string, updateCatDto: UpdateCatDto): Promise<Cat> {
    const updatedCat = await this.catModel
      .findByIdAndUpdate(id, updateCatDto, { new: true })
      .exec();

    if (!updatedCat)
      throw new NotFoundException(`Cat with ID ${id} not found`);

    return updatedCat;
  }

  async remove(id: string): Promise<Cat> {
    const deletedCat = await this.catModel.findByIdAndDelete(id).exec();

    if (!deletedCat)
      throw new NotFoundException(`Cat with ID ${id} not found`);

    return deletedCat;
  }
}
