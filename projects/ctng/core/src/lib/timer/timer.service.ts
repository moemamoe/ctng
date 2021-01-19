import { Injectable } from '@angular/core';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  /**
   * Our subscription to the timer.
   */
  private timerSubscription: Subscription;

  /**
   * Name of Timer for Logger
   */
  public timerName = 'Global Timer';

  /**
   * The refresh triggers.
   */
  private refreshSubject: Subject<number> = new Subject();
  private refreshObservable: Observable<number> = this.refreshSubject.asObservable();

  /**
   * boolean to control the start of the timer
   */
  private timerStarted = false;

  constructor(protected loggerService: LoggerService) {}

  /**
   * Returns the refresh observable.
   */
  public getRefreshObservable() {
    return this.refreshObservable;
  }

  /**
   * Start the Timer
   */
  public startTimer(intervalSeconds: number): void {
    if (this.timerStarted) {
      return;
    }

    this.loggerService.debug('[TS]', `Starting ${this.timerName} with interval:`, intervalSeconds);
    const timerObservable = interval(intervalSeconds * 1000);
    this.timerSubscription = timerObservable.subscribe((num) => this.refreshSubject.next(num));
    this.timerStarted = true;
  }

  /**
   * Stop the Timer
   */
  public stopTimer(): void {
    this.timerStarted = false;
    if (this.timerSubscription) {
      this.loggerService.debug('[TS]', `Stopping ${this.timerName}.`);
      this.timerSubscription.unsubscribe();
    }
  }
}
