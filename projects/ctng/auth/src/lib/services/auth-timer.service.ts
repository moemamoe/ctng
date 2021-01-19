import { Injectable } from '@angular/core';
import { LoggerService, TimerService } from '@ctng/core';

@Injectable({
  providedIn: 'root',
})
export class AuthTimerService extends TimerService {
  public timerName = 'Token Refresh Timer';

  constructor(loggerService: LoggerService) {
    super(loggerService);
  }
}
