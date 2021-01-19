import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CONSOLE_LOGGER_CONFIG, WindowService } from '@ctng/core';
import { spyOnObject, TestHelper, TestMetaData } from '@ctng/testing';
import { AuthModule } from '../lib/auth.module';
import { AuthConfig, AUTH_CONFIG } from '../lib/interfaces/auth.config';
import { AuthProvider } from '../lib/services/auth.provider';
import { AuthService } from '../lib/services/auth.service';
import { MockAuthProvider } from './auth-provider.mock';
import { AuthTestContext } from './auth-test-context';
import { WindowServiceMock } from './window.service.mock';

/**
 * We use a factory, otherwise tests are messing with each other when changing the config.
 * By using the factory we make sure that every test gets its own instance.
 */
const authConfigFactory = (): AuthConfig => {
  return {
    protectedDefaultUri: {
      uri: '/protected',
    },
    publicDefaultUri: {
      uri: '/public',
    },
    toProtectedUriAfterLogin: true,
    refreshTokenIntervalMinutes: 0,
  };
};

export const commonTestMetaData: TestMetaData = {
  providers: [
    {
      provide: CONSOLE_LOGGER_CONFIG,
      useValue: { logLevel: 0 },
    },
    {
      provide: AUTH_CONFIG,
      useFactory: authConfigFactory,
    },
    {
      provide: AuthProvider,
      useClass: MockAuthProvider,
    },
    {
      provide: WindowService,
      useClass: WindowServiceMock,
    },
  ],
  imports: [RouterTestingModule, AuthModule],
  beforeEach: (testContext: AuthTestContext<any>) => {
    testContext.authConfig = TestBed.inject(AUTH_CONFIG);

    // Router stuff
    testContext.mockActivatedRouteSnapshot = new ActivatedRouteSnapshot();
    testContext.mockActivatedRouteSnapshot.queryParams = {};
    testContext.mockRouterStateSnapshot = {
      url: '/protected',
    };
  },
};

/**
 * The helper for all auth tests except AuthService since it provides an AuthService spy.
 */
export const authTestHelper = new TestHelper([
  commonTestMetaData,
  {
    beforeEach: (testContext: AuthTestContext<any>) => {
      testContext.authServiceSpy = spyOnObject(TestBed.inject(AuthService));
    },
  },
]);
