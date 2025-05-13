import {
  // eslint-disable-next-line no-redeclare
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { Cat } from './cats.entity';
import { CreateCatDto } from './dtos/create-cat.dto';
import { UpdateCatDto } from './dtos/update-cat.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';

@ApiTags('Cats')
@Controller('cats')
export class CatsController {

  // private readonly logger = new Logger(CatsController.name);

  constructor(private readonly catsService: CatsService, private readonly logger: LoggerService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new cat' })
  @ApiResponse({ status: 201, description: 'Cat created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createCatDto: CreateCatDto): Promise<Cat> {

    return this.catsService.create(createCatDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cats' })
  @ApiResponse({ status: 200, description: 'List of all cats' })
  async findAll(): Promise<Cat[]> {

    const cats = await this.catsService.findAll();

    this.logger.error('get all cats', cats, [1, 2, 3], 34, Symbol('test'), new Error('error'), new Date(), this.findAll.bind(this));
    this.logger.error({ message: 'get all cats', cats, day: new Date(), fn: this.findAll.bind(this), sym: Symbol('sym'), error: new Error('error') });

    return cats;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single cat by ID' })
  @ApiParam({ name: 'id', description: 'Cat ID' })
  @ApiResponse({ status: 200, description: 'Cat details' })
  @ApiResponse({ status: 404, description: 'Cat not found' })
  findOne(@Param('id') id: string): Promise<Cat | null> {
    return this.catsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a cat' })
  @ApiParam({ name: 'id', description: 'Cat ID' })
  @ApiBody({ type: UpdateCatDto })
  @ApiResponse({ status: 200, description: 'Cat updated successfully' })
  @ApiResponse({ status: 404, description: 'Cat not found' })
  update(
    @Param('id') id: string,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<Cat> {
    return this.catsService.update(id, updateCatDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cat' })
  @ApiParam({ name: 'id', description: 'Cat ID' })
  @ApiResponse({ status: 200, description: 'Cat deleted successfully' })
  @ApiResponse({ status: 404, description: 'Cat not found' })
  remove(@Param('id') id: string): Promise<Cat> {
    return this.catsService.remove(id);
  }
}
