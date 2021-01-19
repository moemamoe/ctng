import { TestHelper, ServiceTestContext, spyOnObject } from '@ctng/testing';
import { LocalStorageService, LoggerService, CONSOLE_LOGGER_CONFIG } from '@ctng/core';
import { JWT_CONFIG } from '../jwt.config';
import { JwtLocalStorageService } from '../jwt-local-storage.service';
import { TestBed } from '@angular/core/testing';
import { TEST_TOKEN } from 'projects/ctng/testing/src/test/test-helper';

interface JwtTestContext extends ServiceTestContext<JwtLocalStorageService> {
  localStorageService: LocalStorageService;

  localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  jwtDecodeSpy: jasmine.Spy;
}

interface Token {
  exp: number;
  type: string;
}

const testHelper = new TestHelper([
  {
    providers: [
      LocalStorageService,
      LoggerService,
      {
        provide: CONSOLE_LOGGER_CONFIG,
        useValue: { logLevel: 0 },
      },
    ],
    beforeEach: (testContext: JwtTestContext) => {
      testContext.localStorageServiceSpy = spyOnObject(TestBed.inject(LocalStorageService));
      testContext.jwtDecodeSpy = spyOn<any>(TestBed.inject(JwtLocalStorageService), 'jwtDecode');
    },
  },
]);

const expectedToken = `TEST_JWT_TOKEN`;
const tokenKey = 'TEST_KEY';

describe('JwtLocalStorageService', function () {
  testHelper.createServiceTestSetup(JwtLocalStorageService);

  it('getToken() should return token from LocalStorageService', function (this: JwtTestContext) {
    // Arrange
    this.localStorageServiceSpy.getItem.and.callFake((key) => {
      expect(key).toEqual(tokenKey, 'Unexptected Token Key found');
      return expectedToken;
    });

    // Act
    const token = this.service.getToken(tokenKey);

    // Assert
    expect(this.localStorageServiceSpy.getItem).toHaveBeenCalledTimes(1);
    expect(token).toEqual(expectedToken, 'Unexpected token returned');
  });

  it('setToken() should save it to LocalStorage', function (this: JwtTestContext) {
    // Arrange
    this.localStorageServiceSpy.setItem.and.callFake((key, token) => {
      expect(key).toEqual(tokenKey, 'Unexptected Token Key found');
      expect(token).toEqual(expectedToken, 'Unexptected Token Key found');
    });

    // Act
    this.service.setToken(tokenKey, expectedToken);

    // Assert
    expect(this.localStorageServiceSpy.setItem).toHaveBeenCalledTimes(1);
  });

  it('clear() should clear LocalStorageService', function (this: JwtTestContext) {
    // Arrange
    this.localStorageServiceSpy.removeItem.and.callFake(() => {});

    // Act
    this.service.clear('TEST_KEY');

    // Assert
    expect(this.localStorageServiceSpy.removeItem).toHaveBeenCalledTimes(1);
  });

  it('isTokenExpired() should return false, if the expiryDate is in the future', function (this: JwtTestContext) {
    const expectedTokenObject: Token = getTestToken(Math.round(new Date().getTime() / 1000) + 86400);

    this.jwtDecodeSpy.and.returnValue(expectedTokenObject);

    // Act
    const tokenExpired = this.service.isTokenExpired(tokenKey, expectedToken);

    // Assert
    expect(this.jwtDecodeSpy).toHaveBeenCalledTimes(1);
    expect(tokenExpired).toBeFalsy('Unexpected Token Expired result');
  });

  it('isTokenExpired() should return true, if the expiryDate is in the past', function (this: JwtTestContext) {
    // Arrange
    // one day in the past
    const expectedTokenObject: Token = getTestToken(Math.round(new Date().getTime() / 1000) - 86400);

    this.jwtDecodeSpy.and.returnValue(expectedTokenObject);

    // Act
    const tokenExpired = this.service.isTokenExpired(tokenKey, expectedToken);

    // Assert
    expect(this.jwtDecodeSpy).toHaveBeenCalledTimes(1);
    expect(tokenExpired).toBeTruthy('Unexpected Token Expired result');
  });

  it('isTokenExpired() should return true, if no expiry date is defined', function (this: JwtTestContext) {
    // Arrange
    const expectedTokenObject: Token = getTestToken(null);

    this.jwtDecodeSpy.and.returnValue(expectedTokenObject);

    // Act
    const tokenExpired = this.service.isTokenExpired(tokenKey, expectedToken);

    // Assert
    expect(this.jwtDecodeSpy).toHaveBeenCalledTimes(1);
    expect(tokenExpired).toBeTruthy('Unexpected Token Expired result');
  });

  it('getTokenExpirationDate() should return expiration data', function (this: JwtTestContext) {
    // Arrange
    const now = new Date();
    const expectedTokenObject: Token = getTestToken(Math.round(now.getTime() / 1000));

    this.jwtDecodeSpy.and.returnValue(expectedTokenObject);

    // Act
    const date = this.service.getTokenExpirationDate(tokenKey, expectedToken);

    // Assert
    expect(this.jwtDecodeSpy).toHaveBeenCalledTimes(1);
    expect(date.getDate()).toEqual(now.getDate(), 'Unexpected expiry date result');
  });

  function getTestToken(expDate: number): Token {
    return {
      exp: expDate,
      type: 'test-token',
    };
  }
});

interface CustomToken {
  customExpDate: number;
}

const testHelperWithConfig = new TestHelper([
  ...testHelper.getCommonTestMetaData(),
  {
    providers: [
      {
        provide: JWT_CONFIG,
        useValue: {
          getExpirationDate: (token: CustomToken) => {
            return new Date(token.customExpDate);
          },
        },
      },
    ],
  },
]);

describe('JwtLocalStorageService with JWT config', function () {
  testHelperWithConfig.createServiceTestSetup(JwtLocalStorageService);

  it('Provided custom JWT config should be used', function (this: JwtTestContext) {
    // Arrange
    const refDate = new Date(2020, 4, 1, 22, 35, 57);
    const expectedTokenObject: CustomToken = {
      customExpDate: Math.round(refDate.getTime()),
    };

    this.jwtDecodeSpy.and.returnValue(expectedTokenObject);

    // Act
    const date = this.service.getTokenExpirationDate(tokenKey, expectedToken);

    // Assert
    expect(date).toEqual(refDate);
  });
});
