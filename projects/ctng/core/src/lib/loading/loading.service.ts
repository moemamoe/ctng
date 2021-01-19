import { Injectable } from '@angular/core';
import { Router, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private loadingObservable: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  public isLoading(): Observable<boolean> {
    return this.loadingObservable;
  }

  public setLoading(isLoading: boolean) {
    this.loadingSubject.next(isLoading);
  }

  private navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loadingSubject.next(true);
    }
    if (event instanceof NavigationEnd) {
      this.loadingSubject.next(false);
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loadingSubject.next(false);
    }
    if (event instanceof NavigationError) {
      this.loadingSubject.next(false);
    }
  }
}
