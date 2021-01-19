import { RouterStateSnapshot } from '@angular/router';
import { AuthTestContext } from '../../../test/auth-test-context';
import { authTestHelper } from '../../../test/test-helper';
import { ProtectedGuard } from '../protected.guard';

describe('ProtectedGuard', function() {
  authTestHelper.createServiceTestSetup(ProtectedGuard);

  it('canActivate() should return false if on any route & not authorized and reroute to public default', function(this: AuthTestContext<
    ProtectedGuard
  >) {
    // Arrange
    this.mockRouterStateSnapshot = {
      url: '/anyroute',
    };

    this.authServiceSpy.isAuthorized.and.returnValue(false);

    // Act
    this.service.canActivate(this.mockActivatedRouteSnapshot, <RouterStateSnapshot>this.mockRouterStateSnapshot).subscribe(canActivate => {
      expect(canActivate).toBeFalse();
    });

    // Assert
    expect(this.authServiceSpy.navigate).toHaveBeenCalledTimes(1);
    expect(this.authServiceSpy.navigate).toHaveBeenCalledWith(
      this.authConfig.publicDefaultUri.uri,
      this.authConfig.publicDefaultUri.external,
    );

    expect(this.authServiceSpy.setInterruptedUrl).toHaveBeenCalledTimes(1);
    expect(this.authServiceSpy.setInterruptedUrl).toHaveBeenCalledWith('/anyroute');
  });

  it('canActivate() should return true if on public default and not authorized', function(this: AuthTestContext<ProtectedGuard>) {
    // Arrange
    this.mockRouterStateSnapshot = {
      url: this.authConfig.publicDefaultUri.uri,
    };

    this.authServiceSpy.isAuthorized.and.returnValue(false);

    // Act
    this.service.canActivate(this.mockActivatedRouteSnapshot, <RouterStateSnapshot>this.mockRouterStateSnapshot).subscribe(canActivate => {
      expect(canActivate).toBeTrue();
    });

    // Assert
    expect(this.authServiceSpy.navigate).not.toHaveBeenCalled();
  });

  it('canActivate() should return true if on any route and authorized', function(this: AuthTestContext<ProtectedGuard>) {
    // Arrange
    this.mockRouterStateSnapshot = {
      url: '/anyroute',
    };

    this.authServiceSpy.isAuthorized.and.returnValue(true);

    // Act
    this.service.canActivate(this.mockActivatedRouteSnapshot, <RouterStateSnapshot>this.mockRouterStateSnapshot).subscribe(canActivate => {
      expect(canActivate).toBeTrue();
    });

    // Assert
    expect(this.authServiceSpy.navigate).not.toHaveBeenCalled();
  });
});
