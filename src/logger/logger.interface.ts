import { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Type } from '@nestjs/common';

export const ELogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

export interface LoggerOptions {
  level?: typeof ELogLevel[keyof typeof ELogLevel];
  dirname?: string;
  maxFiles?: number | string;
  maxFileSize?: string;
  useFile?: boolean;
}

export interface LoggerOptionsFactory { createLoggerOptions(): Promise<LoggerOptions> | LoggerOptions; }

export interface LoggerAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: unknown[]) => Promise<LoggerOptions> | LoggerOptions;
  useClass?: Type<LoggerOptionsFactory>;
  useExisting?: Type<LoggerOptionsFactory>;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}

export const LOGGER_OPTIONS = Symbol('LOGGER_OPTIONS');
