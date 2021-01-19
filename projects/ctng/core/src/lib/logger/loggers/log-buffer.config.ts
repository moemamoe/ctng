import { LogLevel } from '../logLevel';
import { InjectionToken } from '@angular/core';

export const LOG_BUFFER_CONFIG = new InjectionToken<LogBufferConfig>('log_buffer_config');

export class LogBufferConfig {
  logLevel: LogLevel;
  flushBufferLevel: LogLevel;
  maxBufferLength: number;
  includeServiceWorkerState: boolean;
}
