import { Observable } from 'rxjs';
import { HttpRequest } from '@angular/common/http';

export interface Auth {
  /**
   * Checks if user is authorized.
   */
  isAuthorized(): boolean;

  /**
   * Get the current access token.
   */
  getAccessToken(): string;

  /**
   * Check if the token should refresh.
   * e.g. check if token expires until next refresh (interval in config).
   */
  checkRefreshToken?(): boolean;

  /**
   * Function, that should perform refresh token.
   */
  refreshToken?(): Observable<any>;

  /**
   * Auth service logs in. Routes to protected default afterwards if configured.
   */
  login?(user: string, password: string): Observable<any>;

  /**
   * Auth service logs out (either on purpose or due to permission denied).
   */
  logout?(): void;

  /**
   * Checks if request must be skipped by interceptor.
   * Useful for requests such as request token which doesn't require token in headers
   */
  skipRequest?(request: HttpRequest<any>): boolean;

  /**
   * Add token to headers, dependent on server
   * set-up, by default adds a bearer token.
   * Called by interceptor.
   * To change behavior, override this method.
   */
  getHeaders?(token: string): { [name: string]: string | string[] };

  /**
   * Saves last interrupted url inside of the service for further reusage,
   * e.g. restoring interrupted page after logging in
   */
  setInterruptedUrl?(url: string): void;
}
