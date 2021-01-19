import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { WindowService } from '@ctng/core';
import { spyOnObject, TestHelper } from '@ctng/testing';
import { EMPTY, NEVER, of } from 'rxjs';
import { AuthTestContext } from '../../../test/auth-test-context';
import { commonTestMetaData } from '../../../test/test-helper';
import { AuthTimerService } from '../auth-timer.service';
import { AuthProvider } from '../auth.provider';
import { AuthService } from '../auth.service';

interface AuthServiceContext extends AuthTestContext<AuthService> {
  authProviderSpy: jasmine.SpyObj<AuthProvider>;
  navigateByUrlSpy: jasmine.Spy;
  windowNavigateSpy: jasmine.Spy;
}

/**
 * The helper for auth service. Here we spy on the timer service.
 */
const authServiceTestHelper = new TestHelper([
  commonTestMetaData,
  {
    beforeEach: (testContext: AuthServiceContext) => {
      // Our spies
      testContext.authTimerServiceSpy = spyOnObject(TestBed.inject(AuthTimerService));
      testContext.authProviderSpy = spyOnObject(TestBed.inject(AuthProvider));
      testContext.navigateByUrlSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');
      testContext.windowNavigateSpy = spyOn(TestBed.inject(WindowService), 'navigate');

      // By default the timer never returns, can be overwritten
      testContext.authTimerServiceSpy.getRefreshObservable.and.returnValue(NEVER);
    },
  },
]);

describe('AuthService', function() {
  authServiceTestHelper.createServiceTestSetup(AuthService);

  it('should redirect after login if enabled', function(this: AuthServiceContext) {
    this.authConfig.toProtectedUriAfterLogin = true;

    this.authProviderSpy.login.and.returnValue(of('success'));
    this.service.login('test', 'test').subscribe(test => expect(test).toBe('success'));

    expect(this.authProviderSpy.login).toHaveBeenCalledTimes(1);
    expect(this.authProviderSpy.login).toHaveBeenCalledWith('test', 'test');
    expect(this.navigateByUrlSpy).toHaveBeenCalledWith(this.authConfig.protectedDefaultUri.uri);
  });

  it('should not redirect after login if disabled', function(this: AuthServiceContext) {
    this.authConfig.toProtectedUriAfterLogin = false;

    this.authProviderSpy.login.and.returnValue(of('success'));
    this.service.login('test', 'test').subscribe(test => expect(test).toBe('success'));

    expect(this.navigateByUrlSpy).not.toHaveBeenCalled();
  });

  it('should start refresh timer after login if enabled', function(this: AuthServiceContext) {
    this.authConfig.refreshTokenIntervalMinutes = 1;

    this.authProviderSpy.login.and.returnValue(of('success'));
    this.service.login('test', 'test').subscribe(test => expect(test).toBe('success'));

    expect(this.authTimerServiceSpy.startTimer).toHaveBeenCalledTimes(1);
  });

  it('should not start refresh timer after login if disabled', function(this: AuthServiceContext) {
    this.authConfig.refreshTokenIntervalMinutes = 0;

    this.authProviderSpy.login.and.returnValue(of('success'));
    this.service.login('test', 'test').subscribe(test => expect(test).toBe('success'));

    expect(this.authTimerServiceSpy.startTimer).not.toHaveBeenCalled();
  });

  it('should navigate on window if external', function(this: AuthServiceContext) {
    this.service.navigate('test', true);

    expect(this.windowNavigateSpy).toHaveBeenCalledTimes(1);
    expect(this.windowNavigateSpy).toHaveBeenCalledWith('test');
    expect(this.navigateByUrlSpy).toHaveBeenCalledTimes(0);
  });

  it('should navigate with router if not external', function(this: AuthServiceContext) {
    this.service.navigate('test', false);

    expect(this.windowNavigateSpy).toHaveBeenCalledTimes(0);
    expect(this.navigateByUrlSpy).toHaveBeenCalledTimes(1);
    expect(this.navigateByUrlSpy).toHaveBeenCalledWith('test');
  });

  it('should stop timer after logout', function(this: AuthServiceContext) {
    this.service.logout();

    expect(this.authProviderSpy.logout).toHaveBeenCalledTimes(1);
    expect(this.authTimerServiceSpy.stopTimer).toHaveBeenCalledTimes(1);
  });

  it('should set interrupted url in provider', function(this: AuthServiceContext) {
    this.service.setInterruptedUrl('test');

    expect(this.authProviderSpy.setInterruptedUrl).toHaveBeenCalledTimes(1);
    expect(this.authProviderSpy.setInterruptedUrl).toHaveBeenCalledWith('test');
  });

  it('should call skipRequest in provider', function(this: AuthServiceContext) {
    this.service.skipRequest(null);

    expect(this.authProviderSpy.skipRequest).toHaveBeenCalledTimes(1);
    expect(this.authProviderSpy.skipRequest).toHaveBeenCalledWith(null);
  });

  it('should call getAccessToken in provider', function(this: AuthServiceContext) {
    this.service.getAccessToken();

    expect(this.authProviderSpy.getAccessToken).toHaveBeenCalledTimes(1);
  });

  it('should call isAuthorized in provider', function(this: AuthServiceContext) {
    this.service.isAuthorized();

    expect(this.authProviderSpy.isAuthorized).toHaveBeenCalledTimes(1);
  });

  it('should get headers from provider', function(this: AuthServiceContext) {
    this.authProviderSpy.getHeaders.and.callFake(token => {
      return {
        test: token,
      };
    });

    const customHeader = this.service.getHeaders('test token');

    expect(customHeader.test).toBe('test token');
  });

  it('should check And refresh token', function(this: AuthServiceContext) {
    // No refresh
    this.authProviderSpy.checkRefreshToken.and.returnValue(false);
    this.service['checkAndDoRefreshToken']();
    expect(this.authProviderSpy.checkRefreshToken).toHaveBeenCalledTimes(1);
    expect(this.authProviderSpy.refreshToken).toHaveBeenCalledTimes(0);

    // Reset
    this.authProviderSpy.checkRefreshToken.calls.reset();

    // Refresh
    this.authProviderSpy.checkRefreshToken.and.returnValue(true);
    this.authProviderSpy.refreshToken.and.returnValue(EMPTY);
    this.service['checkAndDoRefreshToken']();
    expect(this.authProviderSpy.checkRefreshToken).toHaveBeenCalledTimes(1);
    expect(this.authProviderSpy.refreshToken).toHaveBeenCalledTimes(1);
  });
});

describe('AuthService Setup (not authorized and refresh disabled)', function() {
  authServiceTestHelper.createServiceTestSetup(AuthService, {
    beforeEach: (testContext: AuthServiceContext) => {
      testContext.authConfig.refreshTokenIntervalMinutes = 0;
      testContext.authProviderSpy.isAuthorized.and.returnValue(false);
    },
  });

  it('should not start timer or check refresh token', function(this: AuthServiceContext) {
    expect(this.authTimerServiceSpy.getRefreshObservable).toHaveBeenCalledTimes(1);
    expect(this.authTimerServiceSpy.startTimer).not.toHaveBeenCalled();
    expect(this.authProviderSpy.checkRefreshToken).not.toHaveBeenCalled();
    expect(this.authProviderSpy.refreshToken).not.toHaveBeenCalled();
  });
});

describe('AuthService Setup (authorized and refresh disabled)', function() {
  authServiceTestHelper.createServiceTestSetup(AuthService, {
    beforeEach: (testContext: AuthServiceContext) => {
      testContext.authConfig.refreshTokenIntervalMinutes = 0;
      testContext.authProviderSpy.isAuthorized.and.returnValue(true);
    },
  });

  it('should not start timer or check refresh token', function(this: AuthServiceContext) {
    expect(this.authTimerServiceSpy.startTimer).not.toHaveBeenCalled();
    expect(this.authProviderSpy.checkRefreshToken).not.toHaveBeenCalled();
    expect(this.authProviderSpy.refreshToken).not.toHaveBeenCalled();
  });
});

describe('AuthService Setup (not authorized and refresh enabled)', function() {
  authServiceTestHelper.createServiceTestSetup(AuthService, {
    beforeEach: (testContext: AuthServiceContext) => {
      testContext.authConfig.refreshTokenIntervalMinutes = 1;
      testContext.authProviderSpy.isAuthorized.and.returnValue(false);
    },
  });

  it('should not start timer or check refresh token', function(this: AuthServiceContext) {
    expect(this.authTimerServiceSpy.startTimer).not.toHaveBeenCalled();
    expect(this.authProviderSpy.checkRefreshToken).not.toHaveBeenCalled();
    expect(this.authProviderSpy.refreshToken).not.toHaveBeenCalled();
  });
});

describe('AuthService Setup (authorized and refresh enabled)', function() {
  authServiceTestHelper.createServiceTestSetup(AuthService, {
    beforeEach: (testContext: AuthServiceContext) => {
      testContext.authConfig.refreshTokenIntervalMinutes = 1;
      testContext.authProviderSpy.isAuthorized.and.returnValue(true);
    },
  });

  it('should start timer and check refresh token', function(this: AuthServiceContext) {
    expect(this.authTimerServiceSpy.startTimer).toHaveBeenCalledTimes(1);
    expect(this.authProviderSpy.checkRefreshToken).toHaveBeenCalledTimes(1);
    expect(this.authProviderSpy.refreshToken).toHaveBeenCalledTimes(0);
  });
});
