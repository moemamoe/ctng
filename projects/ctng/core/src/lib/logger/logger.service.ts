/* tslint:disable:no-console */

import { Injectable, Inject, Optional } from '@angular/core';
import { LogLevel } from './logLevel';
import { Logger, LOGGERS } from './loggers/logger';
import { LoggerUtils } from './logger.utils';
import { ConsoleLoggerService } from './loggers/console-logger.service';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor(@Optional() @Inject(LOGGERS) private loggers: Logger[], private consoleLoggerService: ConsoleLoggerService) {
  }

  public error(namespace: string, message: string, ...input: any[]) {
    this.log(LogLevel.error, namespace, message, ...input);
  }

  public warn(namespace: string, message: string, ...input: any[]) {
    this.log(LogLevel.warning, namespace, message, ...input);
  }

  public info(namespace: string, message: string, ...input: any[]) {
    this.log(LogLevel.info, namespace, message, ...input);
  }

  public debug(namespace: string, message: string, ...input: any[]) {
    this.log(LogLevel.debug, namespace, message, ...input);
  }

  public silly(namespace: string, message: string, ...input: any[]) {
    this.log(LogLevel.silly, namespace, message, ...input);
  }

  private log(logLevel: LogLevel, namespace: string, message: any, ...input: any[]) {

    if (message instanceof Error) {
      input.push(message.stack);
      message = message.message;
    }

    const loggerMessage = LoggerUtils.getLog(logLevel, namespace, message, ...input);

    this.consoleLoggerService.log(loggerMessage);

    if (!this.loggers) {
      return;
    }

    this.loggers.forEach(logger => {
      logger.log(loggerMessage);
    });
  }
}
