import { Injectable, Inject } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthConfig, AUTH_CONFIG } from '../interfaces/auth.config';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggerService } from '@ctng/core';

@Injectable({
  providedIn: 'root',
})
export class ProtectedGuard implements CanActivate, CanActivateChild {
  private readonly logName = '[ProtectedGuard]';

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
        if (!isAuthorized && !this.isPublicDefault(state)) {
          // Not authorized, set interrupted and send back to public default
          this.loggerService.silly(this.logName, 'Interrupted access to protected page, not authorized, navigating to public default...');

          this.authService.setInterruptedUrl(state.url);
          this.authService.navigate(this.authConfig.publicDefaultUri.uri, this.authConfig.publicDefaultUri.external);

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
   * Check, if current page is public default page
   */
  private isPublicDefault(state: RouterStateSnapshot): boolean {
    return state.url === this.authConfig.publicDefaultUri.uri;
  }
}
