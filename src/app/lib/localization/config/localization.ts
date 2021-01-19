import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import { LocalizationConfig, LOCALIZATION_CONFIG } from '@ctng/localization';
import { TranslateLoader } from '@ngx-translate/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from "@angular/core";

/**
 * Custom Translation Loader to bundle translation files with hases
 */
@Injectable()
export class WebpackTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    const content = import(`../../../../assets/i18n/${lang}.json`);
    return from(content).pipe(
      map(zoneAwarePromise => {
        return zoneAwarePromise.default;
      }),
    );
  }
}

/**
 * register locales from angular
 */
export function registerLocales() {
  registerLocaleData(localeDe);
  registerLocaleData(localeEn);
}

/**
 * Localization Module configuration
 */
export const localizationConfig: LocalizationConfig = {
  defaultLocale: 'de',
  useWindowLocale: false,
  httpLocaleFolder: '/assets/i18n/',
  localStorageKey: 'lang',
  locales: ['de', 'en'],
  registerLocales: () => registerLocales(),
};

/**
 * Providers for localization configuration
 */
export const localizationProviders = [
  {
    provide: LOCALIZATION_CONFIG,
    useValue: localizationConfig,
  },
  {
    provide: TranslateLoader,
    useClass: WebpackTranslateLoader,
  },
];
