import { CreateCatSchema } from './create-cat.dto';
import { createZodDto } from 'nestjs-zod';

export const UpdateCatSchema = CreateCatSchema.partial();

export class UpdateCatDto extends createZodDto(UpdateCatSchema) { }
