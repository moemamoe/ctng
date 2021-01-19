import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '@ctng/core';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  private readonly logName = '[AuthInterceptor]';

  constructor(public auth: AuthService, private loggerService: LoggerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.skipRequest(req)) {
      return next.handle(req);
    }

    return this.processIntercept(req, next);
  }

  private processIntercept(original: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clone: HttpRequest<any> = original.clone();

    return of(this.addTokenToRequest(clone)).pipe(
      switchMap((req: HttpRequest<any>) => next.handle(req)),
      catchError((res: HttpErrorResponse) => this.responseError(clone, res)),
    );
  }

  /**
   * Adds the token to the specified request.
   */
  private addTokenToRequest(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.auth.getAccessToken();

    if (!token) {
      return req;
    }
    let setHeaders: { [name: string]: string | string[] };

    const customHeader = this.auth.getHeaders(token);

    setHeaders = customHeader ? customHeader : { Authorization: `Bearer ${token}` };

    this.loggerService.silly(this.logName, 'Intercepting request and adding headers', setHeaders);

    return req.clone({ setHeaders });
  }

  /**
   * On error, logs out to reset app.
   */
  private responseError(req: HttpRequest<any>, error: HttpErrorResponse): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401 || error.status === 403) {
        this.auth.logout();
      }
    }

    return throwError(error);
  }
}
