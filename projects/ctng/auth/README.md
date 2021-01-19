# Auth

This package provides an authentication module including public/protected guards and interceptors.

## Usage

1. Provide an `AuthConfig` configuration

```ts
const authConfig: AuthConfig = {
  protectedDefaultUri: {
    uri: '/auth/protected',
  },
  publicDefaultUri: {
    uri: '/auth/public',
  },
  toProtectedUriAfterLogin: true,
  refreshTokenIntervalMinutes: 60,
};
```

- protectedDefaultUri: The external or internal default uri for the protected area. Is used as redirection if user is authorized but on a route protected by `PublicGuard`.
- publicDefaultUri: The external or internal default uri for the publi area. Is used as redirection if user is not authorized but on a route protected by `ProtectedGuard`.
- toProtecteUriAft erLogin: Indicates if auth should redirect to protected default after login was successful.
- refreshTokenIntervalMinutes: Interval in minutes to check for token refresh.

2. Create a custom auth provider by implementing `AuthProvider`

```ts
@Injectable()
export class MyAuthProvider implements AuthProvider {
  public isAuthorized(): boolean {
    return !!sessionStorage.getItem('accessToken');
  }

  public getAccessToken(): string {
    return sessionStorage.getItem('accessToken');
  }

  public checkRefreshToken?(): boolean {
    // Optional: check if token should be refreshed (can be enabled/disabled in config)
    return sessionStorage.getItem('accessToken').expired === true;
  }

  public refreshToken?(): Observable<any> {
    // Optional: refresh token (can be enabled/disabled in config)
    const refreshToken: string = sessionStorage.getItem('refreshToken');

    return this.http.post('http://localhost:8080/refresh-token', { refreshToken });
  }

  public logout?(): void {
    // Optional: React on logout
    sessionStorage.clearItem('accessToken');
  }

  public login?(user: string, password: string): Observable<any> {
    // Optional: Login if available
  }

  public skipRequest?(request: HttpRequest<any>): boolean {
    // Optional: Skip intercepting specific requests
    return req.url.endsWith('req-to-skip');
  }

  public getHeaders?(token: string): { [name: string]: string | string[] } {
    // Optional: custom headers for interceptors
    return {
      customBearer: token,
    };
  }
  public setInterruptedUrl?(url: string): void {
    // Optional: save the interrupted url when logged out of the system, e.g. by 401
    this.interruptedUrl = url;
  }
}
```

3. Import `AuthModule` and provide config and providers

```ts
{
  imports: [
    AuthModule,
  ]
  providers: [
    {
      provide: AUTH_CONFIG,
      useValue: authConfig,
    },
    {
      provide: AuthProvider,
      useClass: MyAuthProvider,
    },
  ],
};
```

4. Use `ProtectedGuard` to protect protected routes and use `PublicGuard` to protect public routes.

```ts
const protectedRoute: Routes = [
  {
    path: '',
    component: SomeComponent,
    canActivate: [ProtectedGuard],
  },
];
```

In this example the user can only access SomeComponent if the `MyAuthProvider` returns true for `isAuthorized`. If not, the user is redirected to `publicDefaultUri` from `AuthConfig`. Same happens for the `PublicGuard`, just the other way around.
