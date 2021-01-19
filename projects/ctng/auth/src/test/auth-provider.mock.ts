import { AuthProvider } from '../lib/services/auth.provider';
import { Observable } from 'rxjs';
import { HttpRequest } from '@angular/common/http';

export class MockAuthProvider implements AuthProvider {
  public isAuthorized(): boolean {
    throw new Error('Method not implemented.');
  }
  public getAccessToken(): string {
    throw new Error('Method not implemented.');
  }
  public checkRefreshToken(): boolean {
    throw new Error('Method not implemented.');
  }
  public refreshToken(): Observable<any> {
    throw new Error('Method not implemented.');
  }
  public logout(): void {
    throw new Error('Method not implemented.');
  }
  public login(user: string, password: string): Observable<any> {
    throw new Error('Method not implemented.');
  }
  public skipRequest(request: HttpRequest<any>): boolean {
    throw new Error('Method not implemented.');
  }
  public getHeaders(token: string): { [name: string]: string | string[] } {
    throw new Error('Method not implemented.');
  }
  public setInterruptedUrl(url: string): void {
    throw new Error('Method not implemented.');
  }
}
