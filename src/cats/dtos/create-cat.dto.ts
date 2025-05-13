// create-cat.dto.ts
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateCatSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
});

export class CreateCatDto extends createZodDto(CreateCatSchema) { }
