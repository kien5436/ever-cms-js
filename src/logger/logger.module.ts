import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import { LoggerService } from './logger.service';
import { LOGGER_OPTIONS, LoggerAsyncOptions, LoggerOptions, LoggerOptionsFactory } from './logger.interface';

@Global()
@Module({})
export class LoggerModule {

  static forRoot(options: LoggerOptions): DynamicModule {

    return {
      module: LoggerModule,
      providers: [
        {
          provide: LOGGER_OPTIONS,
          useValue: options,
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }

  static forRootAsync(options: LoggerAsyncOptions): DynamicModule {

    return {
      module: LoggerModule,
      imports: options.imports || [],
      providers: [
        ...this.createAsyncProviders(options),
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }

  private static createAsyncProviders(options: LoggerAsyncOptions): Provider[] {

    const providers: Provider[] = [this.createAsyncOptionsProvider(options)];

    if (options.useClass)
      providers.push({
        provide: options.useClass,
        useClass: options.useClass,
      });

    return providers;
  }

  private static createAsyncOptionsProvider(options: LoggerAsyncOptions): Provider {

    if (options.useFactory)
      return {
        provide: LOGGER_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };

    return {
      provide: LOGGER_OPTIONS,
      useFactory: async (optionsFactory: LoggerOptionsFactory) => await optionsFactory.createLoggerOptions(),
      inject: [options.useExisting || options.useClass!],
    };
  }
}
