import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvVars } from './env.validator';

@Injectable()
export class EnvService {

  constructor(private readonly configService: ConfigService<EnvVars>) { }

  get<T extends keyof EnvVars>(key: T) {
    return this.configService.get(key, { infer: true });
  }
}
