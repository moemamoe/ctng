import { TestBed } from '@angular/core/testing';
import { LogBufferService } from '../log-buffer.service';
import { LOG_BUFFER_CONFIG, LogBufferConfig } from '../log-buffer.config';
import { LogLevel } from '../../logLevel';
import { LoggerUtils } from '../../logger.utils';
import { testLogsDebug, testLogsMixed, testLogsInfo, testLogsWarning, testLogError, testLogsSilly } from './logs.mock';
import { CONSOLE_LOGGER_CONFIG, ConsoleLoggerConfig } from '../console-logger.config';
import { ConsoleLoggerService } from '../console-logger.service';

describe('ConsoleLoggerService', () => {
  // services
  let consoleLoggerService: ConsoleLoggerService;
  let consoleLoggerConfig: ConsoleLoggerConfig;

  let debugSpy;
  let infoSpy;
  let warningSpy;
  let errorSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CONSOLE_LOGGER_CONFIG,
          useValue: {
            logLevel: LogLevel.error,
          },
        },
        ConsoleLoggerService,
      ],
    });

    consoleLoggerService = TestBed.inject(ConsoleLoggerService);
    consoleLoggerConfig = TestBed.inject(CONSOLE_LOGGER_CONFIG);

    debugSpy = spyOn(console, 'debug');
    infoSpy = spyOn(console, 'info');
    warningSpy = spyOn(console, 'warn');
    errorSpy = spyOn(console, 'error');
  });

  it('should be created', () => {
    expect(consoleLoggerService).toBeTruthy();
  });

  it('should log nothing when off', () => {
    // Arrange
    consoleLoggerConfig.logLevel = LogLevel.off;

    // Act
    logAllLevels();

    // Assert
    expect(debugSpy).toHaveBeenCalledTimes(0);
    expect(infoSpy).toHaveBeenCalledTimes(0);
    expect(warningSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledTimes(0);
  });

  it('should log error only', () => {
    // Arrange
    consoleLoggerConfig.logLevel = LogLevel.error;

    // Act
    logAllLevels();

    // Assert
    expect(debugSpy).toHaveBeenCalledTimes(0);
    expect(infoSpy).toHaveBeenCalledTimes(0);
    expect(warningSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('should log warning and above', () => {
    // Arrange
    consoleLoggerConfig.logLevel = LogLevel.warning;

    // Act
    logAllLevels();

    // Assert
    expect(debugSpy).toHaveBeenCalledTimes(0);
    expect(infoSpy).toHaveBeenCalledTimes(0);
    expect(warningSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('should log info and above', () => {
    // Arrange
    consoleLoggerConfig.logLevel = LogLevel.info;

    // Act
    logAllLevels();

    // Assert
    expect(debugSpy).toHaveBeenCalledTimes(0);
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(warningSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('should log debug and above', () => {
    // Arrange
    consoleLoggerConfig.logLevel = LogLevel.debug;

    // Act
    logAllLevels();

    // Assert
    expect(debugSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(warningSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('should log silly and above', () => {
    // Arrange
    consoleLoggerConfig.logLevel = LogLevel.silly;

    // Act
    logAllLevels();

    // Assert
    expect(debugSpy).toHaveBeenCalledTimes(2);
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(warningSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  function logAllLevels() {
    consoleLoggerService.log(testLogError);
    consoleLoggerService.log(testLogsDebug[0]);
    consoleLoggerService.log(testLogsInfo[0]);
    consoleLoggerService.log(testLogsWarning[0]);
    consoleLoggerService.log(testLogsSilly[0]);
  }
});
