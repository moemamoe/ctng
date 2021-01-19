import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { AUTH_CONFIG, AuthConfig } from '../interfaces/auth.config';
import { Auth } from '../interfaces/auth';
import { AuthProvider } from './auth.provider';
import { Router } from '@angular/router';
import { AuthTimerService } from './auth-timer.service';
import { LoggerService, WindowService } from '@ctng/core';

/**
 * Essential service for authentication
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService implements Auth {
  private readonly logName = '[AuthService]';

  constructor(
    @Inject(AUTH_CONFIG) private authConfig: AuthConfig,
    private loggerService: LoggerService,
    private authTimerService: AuthTimerService,
    private authProvider: AuthProvider,
    private router: Router,
    private windowService: WindowService,
  ) {
    if (this.authConfig.refreshTokenIntervalMinutes && this.isAuthorized()) {
      // start renew token timer
      this.authTimerService.startTimer(this.authConfig.refreshTokenIntervalMinutes * 60);

      // May be we already have to renew token before first interval
      setTimeout(() => this.checkAndDoRefreshToken(), 0);
    }

    // subscribe to the auth timer service
    this.authTimerService.getRefreshObservable().subscribe(test => {
      this.checkAndDoRefreshToken();
    });
  }

  public isAuthorized(): boolean {
    const isAuthorized = this.authProvider.isAuthorized();
    this.loggerService.silly(this.logName, 'Is authorized?', isAuthorized);
    return isAuthorized;
  }

  public getAccessToken(): string {
    this.loggerService.silly(this.logName, 'Get access token');
    return this.authProvider.getAccessToken();
  }

  public checkRefreshToken(): boolean {
    if (typeof this.authProvider.checkRefreshToken === 'function') {
      const refresh = this.authProvider.checkRefreshToken();
      this.loggerService.silly(this.logName, 'Refresh token?', refresh);
      return refresh;
    } else {
      throw new Error('Implement checkRefreshToken in your provider if you want to use refresh timer.');
    }
  }

  public refreshToken(): Observable<any> {
    if (typeof this.authProvider.refreshToken === 'function') {
      this.loggerService.silly(this.logName, 'Refreshing token...');
      return this.authProvider.refreshToken();
    } else {
      throw new Error('Implement refreshToken in your provider if you want to use refresh timer.');
    }
  }

  public skipRequest(request: HttpRequest<any>): boolean {
    if (typeof this.authProvider.skipRequest === 'function') {
      return this.authProvider.skipRequest(request);
    } else {
      // Always false if not defined.
      return false;
    }
  }

  public getHeaders(token: string): { [name: string]: string | string[] } {
    if (typeof this.authProvider.getHeaders === 'function') {
      return this.authProvider.getHeaders(token);
    } else {
      // No headers provided
      return null;
    }
  }

  public setInterruptedUrl(url: string): void {
    if (typeof this.authProvider.setInterruptedUrl === 'function') {
      return this.authProvider.setInterruptedUrl(url);
    }
  }

  public logout(): void {
    this.loggerService.debug(this.logName, 'Logging out...');

    if (typeof this.authProvider.logout === 'function') {
      this.authProvider.logout();
    }

    this.authTimerService.stopTimer();
  }

  public login(user: string, password: string): Observable<any> {
    if (typeof this.authProvider.login === 'function') {
      this.loggerService.debug(this.logName, 'Logging in...');
      return this.authProvider.login(user, password).pipe(
        tap(() => {
          // Login successful
          if (this.authConfig.refreshTokenIntervalMinutes) {
            // start renew token timer
            this.authTimerService.startTimer(this.authConfig.refreshTokenIntervalMinutes * 60);
          }

          if (this.authConfig.toProtectedUriAfterLogin) {
            // Route to protected default
            this.loggerService.silly(this.logName, 'Routing to protected default...');
            this.navigate(this.authConfig.protectedDefaultUri.uri, this.authConfig.protectedDefaultUri.external);
          }
        }),
      );
    } else {
      throw new Error('Please provide login functionality in your auth provider.');
    }
  }

  /**
   * Navigate away from the app / path.
   */
  public navigate(url: string, external = false): void {
    if (external) {
      this.windowService.navigate(url);
    } else {
      this.router.navigateByUrl(url);
    }
  }

  /**
   * Checks if token should be refreshed and does it, if yes.
   */
  private checkAndDoRefreshToken() {
    // Check if the token should be refreshed
    const renew = this.checkRefreshToken();

    if (renew) {
      this.refreshToken().subscribe();
    }
  }
}
