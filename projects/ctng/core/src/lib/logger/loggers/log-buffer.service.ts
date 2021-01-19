import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Log } from '../log';
import { LoggerUtils } from '../logger.utils';
import { LogLevel } from '../logLevel';
import { LogBufferConfig, LOG_BUFFER_CONFIG } from './log-buffer.config';
import { Logger } from './logger';

@Injectable()
export class LogBufferService implements Logger {
  private logBuffer: Log[] = [];

  private bufferFlashSubj: Subject<Log[]> = new Subject();
  private bufferFlashObs: Observable<Log[]> = this.bufferFlashSubj.asObservable();

  constructor(@Inject(LOG_BUFFER_CONFIG) private loggerConfig: LogBufferConfig, private http: HttpClient) {}

  public log(log: Log): void {
    // We do not buffer silly level messages by default
    const isLogLevelEnabled = log.logLevel <= this.loggerConfig.logLevel;

    if (!isLogLevelEnabled) {
      return;
    }

    this.logBuffer.push(log);

    if (log.logLevel <= this.loggerConfig.flushBufferLevel) {
      this.flushBuffer();
    }

    if (this.logBuffer.length > this.loggerConfig.maxBufferLength) {
      this.logBuffer.shift();
    }
  }

  public bufferFlush(): Observable<Log[]> {
    return this.bufferFlashObs;
  }

  private flushBuffer() {
    const currentLogs = this.logBuffer;
    this.logBuffer = [];

    if (this.loggerConfig.includeServiceWorkerState) {
      this.http
        .get('ngsw/state', {
          responseType: 'text',
        })
        .pipe(
          map(res => {
            return res;
          }),
          catchError(err => {
            return of('Could not determine ngsw state');
          }),
        )
        .subscribe(msg => {
          currentLogs.push(LoggerUtils.getLog(LogLevel.info, '[ServiceWorker]', 'Latest state', msg));
          this.bufferFlashSubj.next(currentLogs);
        });
    } else {
      this.bufferFlashSubj.next(currentLogs);
    }
  }
}
