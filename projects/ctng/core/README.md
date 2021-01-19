# Core Module

<section>

## LoggerService

The LoggerService is the service, which should be used to log everything. It can be easily used by injecting it in a service or component. There is no configuration needed.

### Console Logger Service

The ConsoleLoggerService is injected in the LoggerService and is used by default. It is not necessary to provide it in any module of the consuming application.
This service can be configured by providing a `ConsoleLoggerConfig` with the `CONSOLE_LOGGER_CONFIG` injection token in the consuming module.

```typescript
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [{ provide: CONSOLE_LOGGER_CONFIG, useValue: { logLevel: LogLevel.debug } }],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

<br>

### Log Buffer Service

</section>

<section>

## Environment Service

The `EnvironmentService` enables the possibility to provide a custom environment configuration and makes sure that the environment is available on app intialization through the service

There are 3 options to provide an `environment` to the `EnvironmentService`:

1. Providing an environment from a `.json` file with `initAppWithEnvFile()`: This can be used, if the application runs on more than two environments and the application should not be rebuilded.

2. Providing an environment with InjectionToken: The environment can be provided by the `ENVIRONMENT` InjectionToken to the service. This can be only used with static environments (e.g. Angular environment file)

3. Last but not least, if you don't like the implementation at all, you can provide a custom EnvironmentService implementation

<br>

### 1. Loading .json file with initAppWithEnvFile()

To load a environment from a .json file, you have to provide the `EnvironmentService` with the correct Factory:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { EnvironmentService, EnvironmentFileFactory } from '@ctng/core';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [{ provide: EnvironmentService, useFactory: EnvironmentFileFactory }],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Now the `EnvironmentService` assumes the environment loaded from a `.json` file. Next the application bootstrap needs to be changed. Replace the bootstrap logic in `main.ts` with the function `initAppWithEnvFile()`. The `main.ts` should at least look like this:

```typescript
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { initAppWithEnvFile } from '@ctng/core';

if (environment.production) {
  enableProdMode();
}

initAppWithEnvFile(AppModule);
```

<br>

#### initAppWithEnvFile()

- **appModule (required):** This is the AppModule which should be bootstrapped
- **envFileLocation (optional):** custom `.json` file location (Default: `assets/env.json`)
- **errorCallback (optional):** custom `errorCallback` function (Default: `( any ) => void = (value) => console.error('bootstrap-fail', value)`)

<br>

### 2. Provide static environment with InjectionToken

You can provide a static environment with the `ENVIRONMENT` InjectionToken:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { ENVIRONMENT } from '@ctng/core';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [{ provide: ENVIRONMENT, useValue: environment }],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

<br>

### 3. Providing own EnvironmentService

You can provide your own `EnvironmentService`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { EnvironmentService } from '@ctng/core';

export class CustomEnvironmentService {
  public getEnv() {
    return environment;
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [{ provide: EnvironmentService, useClass: CustomEnvironmentService }],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

</section>
