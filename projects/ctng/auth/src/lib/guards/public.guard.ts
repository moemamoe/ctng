import { CanActivate, CanActivateChild, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable, Inject } from '@angular/core';
import { AUTH_CONFIG, AuthConfig } from '../interfaces/auth.config';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '@ctng/core';

@Injectable({ providedIn: 'root' })
export class PublicGuard implements CanActivate, CanActivateChild {
  private readonly logName = '[PublicGuard]';

  constructor(
    private authService: AuthService,
    @Inject(AUTH_CONFIG) private authConfig: AuthConfig,
    private loggerService: LoggerService,
  ) {}

  /**
   * CanActivate handler
   */
  public canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return of(this.authService.isAuthorized()).pipe(
      map((isAuthorized: boolean) => {
        if (isAuthorized && !this.isProtectedDefault(state)) {
          this.loggerService.silly(this.logName, 'Interrupted access to publc page, authorized, navigating to protected default..');
          this.authService.navigate(this.authConfig.protectedDefaultUri.uri, this.authConfig.protectedDefaultUri.external);

          return false;
        }

        return true;
      }),
    );
  }

  /**
   * CanActivateChild handler
   */
  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

  /**
   * Check, if current page is protected default page
   */
  private isProtectedDefault(state: RouterStateSnapshot): boolean {
    return state.url === this.authConfig.protectedDefaultUri.uri;
  }
}
