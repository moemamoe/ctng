import { Auth } from '../interfaces/auth';
import { Observable } from 'rxjs';
import { HttpRequest } from '@angular/common/http';

export abstract class AuthProvider implements Auth {
  public abstract isAuthorized(): boolean;
  public abstract getAccessToken(): string;
  public abstract checkRefreshToken?(): boolean;
  public abstract refreshToken?(): Observable<any>;
  public abstract logout?(): void;
  public abstract login?(user: string, password: string): Observable<any>;
  public abstract skipRequest?(request: HttpRequest<any>): boolean;
  public abstract getHeaders?(token: string): { [name: string]: string | string[] };
  public abstract setInterruptedUrl?(url: string): void;
}
