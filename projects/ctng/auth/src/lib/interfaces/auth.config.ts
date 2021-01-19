import { InjectionToken } from '@angular/core';

export interface DefaultUri {
  /**
   * The default uri value.
   */
  uri: string;

  /**
   * Indicates if the uri is external or app internal.
   */
  external?: boolean;
}

export interface AuthConfig {
  /**
   * The public default uri which is used as fallback route if not authorized.
   */
  publicDefaultUri: DefaultUri;

  /**
   * The protected default uri which is used as fallback route if authorized.
   */
  protectedDefaultUri: DefaultUri;

  /**
   * If set, a timer is started which regularly checks and refreshes the token.
   * Disabled if not set.
   */
  refreshTokenIntervalMinutes?: number;

  /**
   * Indicates if auth should route to protected fallback after login was successful.
   */
  toProtectedUriAfterLogin?: boolean;
}

/**
 * Token to provide AuthConfig.
 */
export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG');
