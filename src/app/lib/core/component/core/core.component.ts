import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoadingService, LocalStorageService, TimerService, LoggerService } from '@ctng/core';
import { Observable } from 'rxjs';

export interface LoadingData {
  loading: boolean;
  loadingText: string;
  actionText: string;
}

export const LOADING_DATA: LoadingData[] = [
  {
    loading: false,
    loadingText: 'No',
    actionText: 'Start',
  },
  {
    loading: true,
    loadingText: 'Yes',
    actionText: 'Stop',
  },
];

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
})
export class CoreComponent implements OnInit {
  @ViewChild('localstoragemessage') inputField: ElementRef;

  public loadingData: LoadingData = LOADING_DATA[0];

  public timerObs$: Observable<number>;
  public timerIntervalSeconds = 1;

  constructor(
    private loadingService: LoadingService,
    private localStorageService: LocalStorageService,
    private timerService: TimerService,
    loggerService: LoggerService,
  ) {
    // subscribe to isLoading
    this.loadingService.isLoading().subscribe(isLoading => this.setLoadingData(isLoading));

    loggerService.debug('[CoreComponentinger]', 'This is a test log', this.loadingData);
  }

  ngOnInit() {
    this.timerObs$ = this.timerService.getRefreshObservable();
  }

  /**
   * LOCALSTORAGE SERVICE
   */
  public writeToLocalStorage(): void {
    this.localStorageService.setItem('TEST_ITEM', this.inputField.nativeElement.value);
  }

  /**
   * LOADING SERVICE
   */
  public toggleLoading(setLoading: boolean): void {
    this.loadingService.setLoading(setLoading);
  }

  private setLoadingData(isLoading: boolean): void {
    this.loadingData = LOADING_DATA.find(data => data.loading === isLoading);
  }

  /**
   * TIMER SERVICE
   */
  public switchTimer(start = true) {
    if (start) {
      this.timerService.startTimer(this.timerIntervalSeconds);
    } else {
      this.timerService.stopTimer();
    }
  }
}
