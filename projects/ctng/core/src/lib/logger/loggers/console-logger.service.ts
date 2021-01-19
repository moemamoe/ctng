import { Logger } from './logger';
import { LogLevel } from '../logLevel';
import { Injectable, Inject, Optional } from '@angular/core';
import { Log } from '../log';
import { LoggerUtils } from '../logger.utils';
import { CONSOLE_LOGGER_CONFIG, ConsoleLoggerConfig } from './console-logger.config';

export const colors = [
  '#16a085',
  '#27ae60',
  '#2980b9',
  '#8e44ad',
  '#2c3e50',
  '#f39c12',
  '#d35400',
  '#c0392b',
  '#7f8c8d',
  '#1abc9c',
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#34495e',
  '#f1c40f',
  '#e67e22',
  '#e74c3c',
];

@Injectable({
  providedIn: 'root',
})
export class ConsoleLoggerService implements Logger {
  constructor(@Optional() @Inject(CONSOLE_LOGGER_CONFIG) private loggerConfig: ConsoleLoggerConfig) {
    if (!this.loggerConfig) {
      this.loggerConfig = {
        logLevel: LogLevel.debug,
      };
      this.log(LoggerUtils.getLog(LogLevel.debug, '[ConsoleLogger]', 'No Console Logger Config set. Using default config'));
    }
    this.log(LoggerUtils.getLog(LogLevel.debug, '[ConsoleLogger]', 'Created Console Logger with config', this.loggerConfig));
  }

  log(log: Log): void {
    const isLogLevelEnabled = log.logLevel <= this.loggerConfig.logLevel;

    if (!isLogLevelEnabled) {
      return;
    }

    let metaString;
    let namespaceColor = '';

    if (this.loggerConfig.disableColor) {
      metaString = `${LogLevel[log.logLevel]} - ${log.namespace}: ${log.message}`;
    } else {
      metaString = `${LogLevel[log.logLevel]} - %c${log.namespace}: ${log.message}`;
      namespaceColor = this.getNamespaceColor(log.namespace);
    }

    const input = log.input && log.input.length > 0 ? log.input : '';

    switch (log.logLevel) {
      case LogLevel.off:
        break;
      case LogLevel.error:
        console.error(metaString, namespaceColor, input);
        break;
      case LogLevel.warning:
        console.warn(metaString, namespaceColor, input);
        break;
      case LogLevel.info:
        /* tslint:disable-next-line */
        console.info(metaString, namespaceColor, input);
        break;
      case LogLevel.debug:
        /* tslint:disable-next-line */
        console.debug(metaString, namespaceColor, input);
        break;
      case LogLevel.silly:
        /* tslint:disable-next-line */
        console.debug(metaString, namespaceColor, input);
        break;
      default:
        throw new Error('Provided unknown log level' + log.logLevel);
    }
  }

  private getNamespaceColor(namespace: string): string {
    let namespaceNumber = 0;
    for (let index = 0; index < namespace.length; index++) {
      namespaceNumber += namespace.charCodeAt(index);
    }

    const i = namespaceNumber % colors.length;
    return `color:${colors[i]};font-size:13px;`;
  }
}
