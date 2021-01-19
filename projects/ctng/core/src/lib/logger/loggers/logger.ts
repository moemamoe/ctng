import { InjectionToken } from '@angular/core';
import { Log } from '../log';

export const LOGGERS = new InjectionToken<Logger[]>('loggers');

export interface Logger {
  log(log: Log): void;
}
