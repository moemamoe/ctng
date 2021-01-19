import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class TimerServiceMock {
  public deviceSettings;

  constructor() {}

  /**
   * Returns the refresh observable.
   */
  public getRefreshObservable() {
    return of(true);
  }
}
