import { AuthConfig } from '@ctng/auth';

/**
 * Usually we declare it in auth, but it is lazy loaded and library auth service is root level.
 * I do not expect that the auth module is lazy loaded, so workaround here, we just import the auth module and configs in root
 */

export const authConfig: AuthConfig = {
  protectedDefaultUri: {
    uri: '/auth/protected',
  },
  publicDefaultUri: {
    uri: '/auth',
  },
  toProtectedUriAfterLogin: true,
  refreshTokenIntervalMinutes: 1,
};
