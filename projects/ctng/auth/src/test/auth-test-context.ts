import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ServiceTestContext } from '@ctng/testing';
import { AuthConfig } from '../lib/interfaces/auth.config';
import { AuthTimerService } from '../lib/services/auth-timer.service';
import { AuthService } from '../lib/services/auth.service';

export interface AuthTestContext<T> extends ServiceTestContext<T> {
  authConfig: AuthConfig;
  authServiceSpy: jasmine.SpyObj<AuthService>;
  authTimerServiceSpy: jasmine.SpyObj<AuthTimerService>;

  mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  mockRouterStateSnapshot: Partial<RouterStateSnapshot>;
}
