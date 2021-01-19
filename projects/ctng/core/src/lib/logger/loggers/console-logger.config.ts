import { LogLevel } from '../logLevel';
import { InjectionToken } from '@angular/core';

export const CONSOLE_LOGGER_CONFIG = new InjectionToken<ConsoleLoggerConfig>( 'console_logger_config' );

export interface ConsoleLoggerConfig {
  logLevel: LogLevel;
  disableColor?: boolean;
}
