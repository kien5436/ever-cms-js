import { BadRequestException } from '@nestjs/common';

export interface ResponseError {
  code: string | number;
  message?: string;
  path?: (string | number)[];
}

export class DuplicateKeyError extends BadRequestException implements ResponseError {

  code: string | number;
  path?: (string | number)[];

  constructor(message: string, path: (string | number)[]) {

    super(message);
    this.code = 'duplicate_key';
    this.message = message;
    this.path = path;
  }
}
