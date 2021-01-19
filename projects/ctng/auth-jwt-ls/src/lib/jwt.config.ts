import { InjectionToken } from '@angular/core';

/**
 * Custom JWT configuration.
 */
export interface JwtConfig {
  /**
   * Extract a custom expiration date out of the token object.
   */
  getExpirationDate?: (token: any) => Date;
}

/**
 * Injection token to provide the JWT configuration.
 */
export const JWT_CONFIG = new InjectionToken('JWT_CONFIG');
