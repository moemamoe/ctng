import { Injectable, Inject, Optional } from '@angular/core';
import { LoggerService, LocalStorageService } from '@ctng/core';
import * as jwt_decode from 'jwt-decode';
import { JWT_CONFIG, JwtConfig } from './jwt.config';

@Injectable({
  providedIn: 'root',
})
export class JwtLocalStorageService {
  private readonly logName = '[TokenService]';
  private jwtDecode = jwt_decode;

  constructor(
    @Optional() @Inject(JWT_CONFIG) private config: JwtConfig,
    private localStorageService: LocalStorageService,
    private loggerService: LoggerService,
  ) {}

  /**
   * Gets the token.
   */
  public getToken(key: string): string {
    return this.localStorageService.getItem(key);
  }

  /**
   * Sets the token.
   */
  public setToken(key: string, token: string) {
    this.localStorageService.setItem(key, token);
  }

  /**
   * Clears the token.
   */
  public clear(key: string) {
    this.localStorageService.removeItem(key);
  }

  /**
   * Determines, if the token is expired or not.
   *
   * @param token: JWT token string. Key is ignored if token is provided.
   */
  public isTokenExpired(key: string, token?: string): boolean {
    const tokenDecoded = this.decodeToken(key, token);

    const date = this.convertTokenExpirationDate(tokenDecoded);

    if (date === null) {
      return true;
    }

    // If current date is bigger than the token expiration date
    const isExpired = !(date.valueOf() > new Date().valueOf());
    this.loggerService.silly(this.logName, 'IsTokenExpired was called and returns', isExpired, date, new Date());

    return isExpired;
  }

  /**
   * Returns the expiration date of the token.
   *
   * @param token: JWT token string. Key is ignored if token is provided.
   */
  public getTokenExpirationDate(key: string, token?: string): Date {
    const tokenDecoded = this.decodeToken(key, token);

    return this.convertTokenExpirationDate(tokenDecoded);
  }

  /**
   * Returns the
   * @param token: Token Object
   */
  private convertTokenExpirationDate(token: any): Date {
    if (!token) {
      return null;
    }

    if (this.config && typeof this.config.getExpirationDate === 'function') {
      // Individual expiration date
      return this.config.getExpirationDate(token);
    }

    // Let's try if there is an standard exp property on the jwt
    if (!token.exp) {
      return null;
    }

    const expirationDate = new Date(token.exp * 1000);

    return expirationDate;
  }

  /**
   *
   * @param token: (optional) Token string. If not set the token will be get from the local storage
   */
  public decodeToken(key: string, token?: string): any {
    if (!token) {
      token = this.getToken(key);
    }

    if (!token) {
      this.loggerService.debug(this.logName, 'No token available');
      return null;
    }

    try {
      return this.jwtDecode<any>(token);
    } catch (error) {
      this.loggerService.error(this.logName, 'Failed to decode token!', token, error);
      return null;
    }
  }
}
