# Auth-Jwt-Ls

This is a library for handling Json Web Tokens by using the [jwt-decode](https://github.com/auth0/jwt-decode) library and local storage to persist the token. Additionally it checks if the token is expired.

## Usage

Just inject the `JwtLocalStorageService` and

- set/get tokens
- get token's expiration date
- check if token is expired
- remove token from local storage

### Custom config

By default `JwtLocalStorageService` assumes that the token object has an `exp` property with time value in seconds.

If a the token has a different structure or format, a custom `JwtConfig` can be provided:

```ts
{
  provide: JWT_CONFIG,
  useValue: {
    getExpirationDate: (token: CustomToken) => {
      return new Date(token.customExpDate);
    },
  },
},
```
