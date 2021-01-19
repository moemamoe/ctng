import { AUTH_CONFIG, AuthProvider } from '@ctng/auth';
import { authConfig } from './auth.config';
import { jwtConfig } from './jwt.config';
import { JwtLsAuthProvider } from './jwt-ls-auth.provider';
import { JWT_CONFIG } from '@ctng/auth-jwt-ls';

export const authProviders = [
  {
    provide: AUTH_CONFIG,
    useValue: authConfig,
  },
  {
    provide: JWT_CONFIG,
    useValue: jwtConfig,
  },
  {
    provide: AuthProvider,
    useClass: JwtLsAuthProvider,
  },
];
