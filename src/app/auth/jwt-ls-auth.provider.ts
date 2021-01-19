import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthProvider } from '@ctng/auth';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { authConfig } from './auth.config';
import { JwtLocalStorageService } from '@ctng/auth-jwt-ls';

@Injectable()
export class JwtLsAuthProvider implements AuthProvider {
  public readonly localStorageJwtKey = '_jwt';

  constructor(private jwtService: JwtLocalStorageService, private http: HttpClient) {}

  public isAuthorized(): boolean {
    return !this.jwtService.isTokenExpired(this.localStorageJwtKey);
  }

  public getAccessToken(): string {
    return this.jwtService.getToken(this.localStorageJwtKey);
  }

  public checkRefreshToken(): boolean {
    // Check if token expires within next interval
    const expirateDate: Date = this.jwtService.getTokenExpirationDate(this.localStorageJwtKey);
    const expectedValidTime: Date = new Date();
    expectedValidTime.setSeconds(expectedValidTime.getSeconds() + authConfig.refreshTokenIntervalMinutes * 60);

    if (!expirateDate || expectedValidTime.getTime() >= expirateDate.getTime()) {
      return true;
    }

    return false;
  }

  public refreshToken(): Observable<any> {
    return this.http
      .post<{ jwt: string }>('/api/refreshtoken', {
        jwt: this.getAccessToken(),
      })
      .pipe(
        tap((res) => {
          this.jwtService.setToken(this.localStorageJwtKey, res.jwt);
        }),
      );
  }

  public logout(): void {
    this.jwtService.clear(this.localStorageJwtKey);
  }

  public login(user: string, password: string): Observable<any> {
    return this.http
      .post<{ jwt: string }>('/api/login', {
        user: user,
        password: password,
      })
      .pipe(
        tap((res) => {
          this.jwtService.setToken(this.localStorageJwtKey, res.jwt);
        }),
      );
  }
}
