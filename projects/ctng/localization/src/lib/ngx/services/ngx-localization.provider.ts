import { Injectable } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocaleChangeResult } from '../../interfaces/locale.change';
import { LocalizationProvider } from '../../services/localization.provider';

@Injectable()
export class NgxLocalizationProvider implements LocalizationProvider {
  constructor(private translateService: TranslateService) {}

  /**
   * Retuns single translations by key
   * @param key: lang key
   * @param interpolateParams: interpolation params
   */
  public get(key: string | string[], interpolateParams: Object = null): Observable<any> {
    return this.translateService.get(key, interpolateParams);
  }

  /**
   * Main function to switch the locale
   * @param lang: locale string
   */
  public use(lang: string): Observable<any> {
    return this.translateService.use(lang);
  }

  /**
   * Locale changed event
   */
  public onLocaleChange(): Observable<LocaleChangeResult> {
    return this.translateService.onLangChange.pipe(
      map((event: LangChangeEvent) => {
        return {
          locale: event.lang,
          translations: event.translations,
        };
      }),
    );
  }

  /**
   * Returns the current locale
   */
  public getCurrentLocale(): string {
    return this.translateService.currentLang
      ? this.translateService.currentLang
      : this.translateService.defaultLang
      ? this.translateService.defaultLang
      : null;
  }

  /**
   * Adds the locales from the config
   */
  public addLocales(locales: string[]): void {
    this.translateService.addLangs(locales);
  }

  /**
   * Sets the default locale string
   * @param locale: locale stirng
   */
  public setDefaultLocale(locale: string): void {
    this.translateService.setDefaultLang(locale);
  }
}
