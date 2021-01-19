# Localization Module

Internationalization Module for Angular with use of Window and Local Storage

The localization module can be used in two ways:

1. Provided own translation implementation (`LocalizationModule`)
2. Use Angular translation library [ngx-translate](https://https://github.com/ngx-translate/core) (`NgxLocalizationModule`)

This module provides the possibility to configure the initialization of the internationalization and contains the following components:

- DateFormatDirective

## LocalizationConfig

To use the `LocalizationModule` you have to provided a configuration by the following `LOCALIZATION_CONFIG` injection token:

```ts
// src/lib/interfaces/localization.config.ts#L3-L20

/**
 * Localization config to run the localization
 */
export interface LocalizationConfig {
  defaultLocale: string;
  locales: string[];
  httpLocaleFolder?: string;
  httpParameterHash?: string;
  useWindowLocale?: boolean;
  localStorageKey?: string;
  registerLocales?: () => void;
}

/**
 * Localization config injection token
 */
export const LOCALIZATION_CONFIG = new InjectionToken<LocalizationConfig>('localization_config');
```

The following properties are **required**

1. **defaultLocale** sets the default language of the localization (_needs to be included in the locales string array_)
2. **locales** is a list of all supported locale strings

The following properties are **optional**

1. **useWindowLocale** initializes the localization with the user window language, if it is in the list of supported **locales**
2. **localStorageKey** initializes the localization with a key of a local storage item, if it is in the list of supported **locales**
3. **registerLocales()** will be called, when Angular's locale data should be registered. **Note: Angular is shipped with englisch only locale data. For more than english, in this callback the locale data has to be registered. Otherwise Angular Directives will fail**

The following properties are **optional** for the use of `NgxLocalizationModule`

1. **httpLocaleFolder** set the location of the translation files, which will be fetch by the `HttpTranslateLoader` by default
2. **httpParameterHash** can be used to prevent caching problems for the translation files, which are fetched by Http request (e.g. build number, ...)

## Localization initialization

By injecting the `LocalizationService` it intializes itself based on the provided configuration. The initialization takes the following order:

1. Localstorage locale
2. Window locale
3. Default locale from the config

## LocalizationModule

For the use of the `LocalizationModule` you **must** provide your own `LocalizationProvider` implementation, which has to implement the `LocalizationProvider` abstract class. See below:

```ts
// src/lib/services/test/localization.mock.provider.ts#L6-L32

@Injectable()
export class LocalizationMockProvider implements LocalizationProvider {
  public get(key: string | string[], interpolateParams: Object): Observable<any> {
    throw Error('Not implemented');
  }

  public use(lang: string): Observable<any> {
    throw Error('Not implemented');
  }

  public onLocaleChange(): Observable<LocaleChangeResult> {
    throw Error('Not implemented');
  }

  public getCurrentLocale(): string {
    throw Error('Not implemented');
  }

  public addLocales(locales: string[]): void {
    throw Error('Not implemented');
  }

  public setDefaultLocale(locale: string): void {
    throw Error('Not implemented');
  }
}
```

The `LocalizationModule` has to be imported **ONCE** with `.forRoot()` with the `LocalizationProvider` and `LocalizationConfig`.

```ts
// examples/localization.module.example.ts#L9-L23

@NgModule({
  declarations: [],
  imports: [CommonModule, LocalizationModule.forRoot()],
  providers: [
    {
      provide: LOCALIZATION_CONFIG,
      useValue: {
        defaultLocale: 'en',
        locales: ['en', 'de'],
      },
    },
    { provide: LocalizationProvider, useClass: LocalizationMockProvider },
  ],
})
export class AppModule {}
```

## NgxLocalizationModule

With using the `NgxLocalizationModule` the ngx-translate library is used. The module has to be imported **ONCE** with `.forRoot()` and the `LocalizationConfig`.

```ts
// examples/ngx-localization.module.example.ts#L8-L21

@NgModule({
  declarations: [],
  imports: [CommonModule, NgxLocalizationModule.forRoot()],
  providers: [
    {
      provide: LOCALIZATION_CONFIG,
      useValue: {
        defaultLocale: 'en',
        locales: ['en', 'de'],
      },
    },
  ],
})
export class AppModule {}
```

### HttpTranslateLoader (default)

By default it is using the `HttpTranslateLoader`, which needs `httpLocaleFolder` as **required** setting in the `LocalizationConfig`. The configuration would look like the following.

```ts
// examples/ngx-localization.module-http.example.ts#L8-L22

@NgModule({
  declarations: [],
  imports: [CommonModule, NgxLocalizationModule.forRoot()],
  providers: [
    {
      provide: LOCALIZATION_CONFIG,
      useValue: {
        defaultLocale: 'en',
        locales: ['en', 'de'],
        httpLocaleFolder: '/assets/i18n/',
      },
    },
  ],
})
export class AppModule {}
```

### WebpackTranslateLoader

Webpack can also be used for loading the language files. Therefore the language files will be compiled as _hashed js bundles_. To achieve this, the default `TranslateLoader` of the ngx-translate library has to be provided by a special implementation (see below)

```ts
// examples/ngx-localization.module-webpack.example.ts#L8-L36

export class WebpackTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    const content = import(`PATH_TO_TRANSLATION_FOLDER/${lang}.json`);
    return from(content).pipe(
      map(zoneAwarePromise => {
        return zoneAwarePromise.default;
      }),
    );
  }
}

@NgModule({
  declarations: [],
  imports: [CommonModule, NgxLocalizationModule.forRoot()],
  providers: [
    {
      provide: LOCALIZATION_CONFIG,
      useValue: {
        defaultLocale: 'en',
        locales: ['en', 'de'],
      },
    },
    {
      provide: TranslateLoader,
      useClass: WebpackTranslateLoader,
    },
  ],
})
export class AppModule {}
```

## DateFormatDirective

The DateFormatDirective is using the Angular Date Pipe under the hood. See [Angular Date Pipe](https://angular.io/api/common/DatePipe) for formatting information

`@Input`

- date (Date): Javascript Date object, which should be localized and formatted
- format (string, optional): Format string for localized date string
- todayFormat (string, optional): Format string, when the input date is on the same day

### Usage

```html
<p ctDateFormat [date]="date" [format]="format" [todayFormat]="todayFormat"></p>
```
