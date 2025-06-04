import { Test } from '@nestjs/testing';
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import * as path from 'node:path';

import { LoggerModule } from './logger.module';
import { LoggerService } from './logger.service';
import { ELogLevel } from './logger.interface';

describe('LoggerService', () => {

  let loggerService: LoggerService;

  describe('constructor', () => {

    it('should create successfully with default options', async () => {
      const module = await Test.createTestingModule({ imports: [LoggerModule.forRoot({})] }).compile();

      loggerService = module.get<LoggerService>(LoggerService);

      expect(loggerService).toBeDefined();
    });

    it('should create with custom log level', async () => {
      const module = await Test.createTestingModule({ imports: [LoggerModule.forRoot({ level: ELogLevel.ERROR })] }).compile();

      loggerService = module.get<LoggerService>(LoggerService);

      expect(loggerService).toBeDefined();
    });

    describe('with file transport', () => {

      const dirname = path.resolve('./test-logs');

      function cleanTestDir() {
        if (existsSync(dirname))
          rmSync(dirname, { recursive: true, force: true });
      }

      beforeEach(cleanTestDir);

      afterEach(cleanTestDir);

      it('should create file transport when `useFile` is true', async () => {
        const module = await Test.createTestingModule({ imports: [LoggerModule.forRoot({ useFile: true, dirname })] }).compile();

        loggerService = module.get<LoggerService>(LoggerService);

        expect(loggerService).toBeDefined();

        loggerService.info('Test file creation');

        await new Promise((resolve) => { setTimeout(resolve, 10) }); // wait a few ms for file creation

        const files = readdirSync(dirname);

        expect(files.length).toBeGreaterThan(0);
        expect(files.some((f) => f.endsWith('.log'))).toBeTruthy();

        const logFile = path.resolve(dirname, files.find((f) => f.endsWith('.log'))!);
        const content = readFileSync(logFile, 'utf-8');

        expect(content).toContain('Test file creation');
      });

    });
  });

  describe('detectContext', () => {

    beforeEach(async () => {
      const module = await Test.createTestingModule({ imports: [LoggerModule.forRoot({ level: ELogLevel.ERROR })] }).compile();

      loggerService = module.get<LoggerService>(LoggerService);
    });

    it('should detect context from class name', () => {

      class TestClass {
        constructor(private logger: LoggerService) { }

        testContext() {

          this.logger.info('test');

          return this.logger.getContext();
        }
      }

      const testInstance = new TestClass(loggerService);

      expect(testInstance.testContext()).toBe('TestClass');
    });
  });
});
