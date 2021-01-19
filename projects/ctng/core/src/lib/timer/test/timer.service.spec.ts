import { TestBed, inject } from '@angular/core/testing';

import { TimerService } from '../timer.service';
import { LoggerService } from '../../logger/logger.service';
import { CONSOLE_LOGGER_CONFIG, LogLevel } from '../../logger';
import { loogerTestConfig } from '../../logger/loggers/test/logger-test.config';

describe('TimerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimerService, LoggerService, loogerTestConfig],
    });
  });

  it('should be created', inject([TimerService], (service: TimerService) => {
    expect(service).toBeTruthy();
  }));

  it('getRefreshObservable() should return refresh Observable', inject([TimerService], (service: TimerService) => {
    const refreshObservable = service.getRefreshObservable();
    expect(refreshObservable).toBeDefined('Unexpected refreshObservable returned. Should be defined');
  }));

  it('startTimer() should start Timer and throw refresh event and stopTimer() should stop it', inject(
    [TimerService],
    (service: TimerService) => {
      const refreshObservable = service.getRefreshObservable();

      refreshObservable.subscribe((num) => {
        (service as any).stopTimer();
        expect(num).toEqual(0, 'Unexpected Timer Index. Should be 0');
      });

      service['startTimer'](1);
      service['startTimer'](5);
    },
  ));
});
