import { AuthInterceptor } from '../auth.interceptor';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthTestContext } from '../../../test/auth-test-context';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { authTestHelper } from '../../../test/test-helper';

interface AuthInterceptorContext extends AuthTestContext<AuthInterceptor> {
  httpMock: HttpTestingController;
}

describe('AuthInterceptor', function() {
  authTestHelper.createServiceTestSetup(AuthInterceptor, {
    imports: [HttpClientTestingModule],
  });

  beforeEach(function(this: AuthInterceptorContext) {
    this.httpMock = TestBed.inject(HttpTestingController);
  });

  it('should intercept http call and set token in Authorization header', function(this: AuthInterceptorContext) {
    const testUrl = 'some/test/url';
    const testToken = 'test token string';
    this.authServiceSpy.getAccessToken.and.returnValue(testToken);

    TestBed.inject(HttpClient)
      .get(testUrl)
      .subscribe();

    const httpRequest = this.httpMock.expectOne(testUrl);
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    expect(httpRequest.request.headers.get('Authorization')).toBe('Bearer ' + testToken);
  });

  it('should intercept http call and set custom header', function(this: AuthInterceptorContext) {
    this.authServiceSpy.getHeaders.and.callFake(token => {
      return {
        test: token,
      };
    });
    const testUrl = 'some/test/url';
    const testToken = 'test token string';
    this.authServiceSpy.getAccessToken.and.returnValue(testToken);

    TestBed.inject(HttpClient)
      .get(testUrl)
      .subscribe();

    const httpRequest = this.httpMock.expectOne(testUrl);
    expect(httpRequest.request.headers.has('Authorization')).toEqual(false);
    expect(httpRequest.request.headers.has('test')).toEqual(true);
    expect(httpRequest.request.headers.get('test')).toBe(testToken);
  });

  it('should skip the http interception if configured', function(this: AuthInterceptorContext) {
    const testUrl = 'some/test/url';
    this.authServiceSpy.skipRequest.and.callFake((req: HttpRequest<any>) => {
      // Skip this test request
      return req.url === testUrl;
    });

    TestBed.inject(HttpClient)
      .get(testUrl)
      .subscribe();

    const httpRequest = this.httpMock.expectOne(testUrl);
    expect(httpRequest.request.headers.has('Authorization')).toEqual(false);
    expect(httpRequest.request.headers.get('Authorization')).toBeNull();
  });

  it('401 status should log out', function(this: AuthInterceptorContext) {
    checkErrorStatus(this, 401);
  });

  it('403 status should log out', function(this: AuthInterceptorContext) {
    checkErrorStatus(this, 403);
  });

  it('500 status should not log out', function(this: AuthInterceptorContext) {
    checkErrorStatus(this, 500, false);
  });

  function checkErrorStatus(context: AuthInterceptorContext, status: number, expectLogOutCalled = true) {
    const testUrl = 'some/test/url';
    const mockErrorResponse = { status: status, statusText: 'Unauthorized' };

    TestBed.inject(HttpClient)
      .get(testUrl)
      .subscribe(
        () => {},
        error => {
          expect(error.status).toBe(status);
        },
      );

    context.authServiceSpy.logout.and.callFake(() => {});
    context.httpMock.expectOne(testUrl).flush('test', mockErrorResponse);
    if (expectLogOutCalled) {
      expect(context.authServiceSpy.logout).toHaveBeenCalled();
    } else {
      expect(context.authServiceSpy.logout).not.toHaveBeenCalled();
    }
  }
});
