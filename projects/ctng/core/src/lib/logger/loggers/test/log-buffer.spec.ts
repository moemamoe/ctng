import { TestBed, tick } from '@angular/core/testing';
import { LogBufferService } from '../log-buffer.service';
import { LOG_BUFFER_CONFIG, LogBufferConfig } from '../log-buffer.config';
import { LogLevel } from '../../logLevel';
import { LoggerUtils } from '../../logger.utils';
import { testLogsDebug, testLogsMixed, testLogsInfo, testLogsWarning } from './logs.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';

describe('LogBufferService', () => {
  // services
  let logBufferService: LogBufferService;
  let logBufferConfig: LogBufferConfig;

  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: LOG_BUFFER_CONFIG,
          useValue: {
            logLevel: LogLevel.debug,
            maxBufferLength: 50,
            flushBufferLevel: LogLevel.error,
            includeServiceWorkerState: false,
          },
        },
        LogBufferService,
      ],
    });

    logBufferService = TestBed.inject(LogBufferService);
    logBufferConfig = TestBed.inject(LOG_BUFFER_CONFIG);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(logBufferService).toBeTruthy();
  });

  it('should add logs to buffer correctly', () => {
    // Act
    testLogsMixed.forEach(log => {
      logBufferService.log(log);
    });

    // Assert
    // No silly messages due to config + the constructor message
    expect(logBufferService['logBuffer'].length).toBe(testLogsDebug.length + testLogsInfo.length + testLogsWarning.length);
  });

  it('should respect log level', () => {
    // Arrange
    logBufferConfig.logLevel = LogLevel.error;

    // Act
    testLogsMixed.forEach(log => {
      logBufferService.log(log);
    });

    // Assert
    // Only the constructor message
    expect(logBufferService['logBuffer'].length).toBe(0);
  });

  it('should remove buffer items over max and not flush', () => {
    // Arrange
    logBufferConfig.maxBufferLength = 10;

    let bufferFlushed = false;
    logBufferService.bufferFlush().subscribe(logs => {
      bufferFlushed = true;
    });

    // Act
    testLogsDebug.forEach(log => {
      logBufferService.log(log);
    });

    // Assert
    // Should be full
    expect(logBufferService['logBuffer'].length).toBe(logBufferConfig.maxBufferLength);
    expect(bufferFlushed).toBeFalsy();
  });

  it('should flush correctly without sw', () => {
    // Arrange
    logBufferConfig.logLevel = LogLevel.info;
    const errorLog = LoggerUtils.getLog(LogLevel.error, 'test', 'test message');
    let bufferFlushed = false;
    logBufferService.bufferFlush().subscribe(logs => {
      bufferFlushed = true;
      // All buffer logs plus error log
      expect(logs.length).toBe(testLogsInfo.length + testLogsWarning.length + 1);
      expect(logs[logs.length - 1]).toEqual(errorLog);
    });

    const getHttpImageSpy = spyOn(httpClient, 'get').and.callFake(() => of(null));

    // Act
    testLogsMixed.forEach(log => {
      logBufferService.log(log);
    });

    // Assert
    expect(logBufferService['logBuffer'].length).toBe(testLogsInfo.length + testLogsWarning.length);
    expect(bufferFlushed).toBeFalsy();

    // Act
    logBufferService.log(errorLog);

    // Assert
    // Should be empty again
    expect(logBufferService['logBuffer'].length).toBe(0);
    expect(bufferFlushed).toBeTruthy();
    expect(getHttpImageSpy).toHaveBeenCalledTimes(0);
  });

  it('should flush correctly with sw state', () => {
    // Arrange
    logBufferConfig.includeServiceWorkerState = true;
    logBufferConfig.logLevel = LogLevel.info;
    const errorLog = LoggerUtils.getLog(LogLevel.error, 'test', 'test message');
    const ngswLog = LoggerUtils.getLog(LogLevel.info, '[ServiceWorker]', 'Latest state', 'Fake NGSW state');
    let bufferFlushed = false;
    logBufferService.bufferFlush().subscribe(logs => {
      bufferFlushed = true;
      // All buffer logs plus error log plus ngsw state log
      expect(logs.length).toBe(testLogsInfo.length + testLogsWarning.length + 2);
      expect(logs[logs.length - 2]).toEqual(errorLog);
      expect(logs[logs.length - 1].input).toEqual(ngswLog.input);
    });

    const getHttpImageSpy = spyOn(httpClient, 'get').and.callFake(() => of(ngswLog.input[0]));

    // Act
    testLogsMixed.forEach(log => {
      logBufferService.log(log);
    });

    // Assert
    expect(logBufferService['logBuffer'].length).toBe(testLogsInfo.length + testLogsWarning.length);
    expect(bufferFlushed).toBeFalsy();

    // Act
    logBufferService.log(errorLog);

    // Assert
    // Should be empty again
    expect(logBufferService['logBuffer'].length).toBe(0);
    expect(bufferFlushed).toBeTruthy();
    expect(getHttpImageSpy).toHaveBeenCalledTimes(1);

    // DISABLED DUE TO TYPING ERROR
    // expect(getHttpImageSpy).toHaveBeenCalledWith('ngsw/state', { responseType: 'text' });
  });
});
