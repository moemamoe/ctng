import { RouterStateSnapshot } from '@angular/router';
import { AuthTestContext } from '../../../test/auth-test-context';
import { authTestHelper } from '../../../test/test-helper';
import { PublicGuard } from '../public.guard';

describe('PublicGuard', function() {
  authTestHelper.createServiceTestSetup(PublicGuard);

  it('canActivate() should return false if on any route & authorized and reroute to protected default', function(this: AuthTestContext<
    PublicGuard
  >) {
    // Arrange
    this.mockRouterStateSnapshot = {
      url: '/anyroute',
    };

    this.authServiceSpy.isAuthorized.and.returnValue(true);

    // Act
    this.service.canActivate(this.mockActivatedRouteSnapshot, <RouterStateSnapshot>this.mockRouterStateSnapshot).subscribe(canActivate => {
      expect(canActivate).toBeFalse();
    });

    // Assert
    expect(this.authServiceSpy.navigate).toHaveBeenCalledTimes(1);
    expect(this.authServiceSpy.navigate).toHaveBeenCalledWith(
      this.authConfig.protectedDefaultUri.uri,
      this.authConfig.protectedDefaultUri.external,
    );
  });

  it('canActivate() should return true if on protected default and authorized', function(this: AuthTestContext<PublicGuard>) {
    // Arrange
    this.mockRouterStateSnapshot = {
      url: this.authConfig.protectedDefaultUri.uri,
    };

    this.authServiceSpy.isAuthorized.and.returnValue(true);

    // Act
    this.service.canActivate(this.mockActivatedRouteSnapshot, <RouterStateSnapshot>this.mockRouterStateSnapshot).subscribe(canActivate => {
      expect(canActivate).toBeTrue();
    });

    // Assert
    expect(this.authServiceSpy.navigate).not.toHaveBeenCalled();
  });

  it('canActivate() should return true if on any route and not authorized', function(this: AuthTestContext<PublicGuard>) {
    // Arrange
    this.mockRouterStateSnapshot = {
      url: '/anyroute',
    };

    this.authServiceSpy.isAuthorized.and.returnValue(false);

    // Act
    this.service.canActivate(this.mockActivatedRouteSnapshot, <RouterStateSnapshot>this.mockRouterStateSnapshot).subscribe(canActivate => {
      expect(canActivate).toBeTrue();
    });

    // Assert
    expect(this.authServiceSpy.navigate).not.toHaveBeenCalled();
  });
});
