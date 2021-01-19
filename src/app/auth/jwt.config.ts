import { JwtConfig } from '@ctng/auth-jwt-ls';

export interface Token {
  expirationDate: number;
}

export const jwtConfig: JwtConfig = {
  // NOTE: By default the jwt service uses the exp property, you only have to provide a function for overriding if exp date is stored different
  getExpirationDate: (token) => {
    return new Date(token.expirationDate);
  },
};
