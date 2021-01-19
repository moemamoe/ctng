import { Observable } from 'rxjs';
import { LocaleChangeResult } from './locale.change';

export interface Localization {
  /**
   * Retuns single translations by key
   * @param key locale key
   * @param interpolateParams: interpolation params
   */
  get(key: string | string[], interpolateParams: Object): Observable<any>;

  /**
   * Switches the locale
   * @param lang: locale string
   */
  use(lang: string): Observable<any>;

  /**
   * Change event, when locale was switched with use function
   */
  onLocaleChange(): Observable<LocaleChangeResult>;

  /**
   * Returns the current locale
   */
  getCurrentLocale(): string;

  /**
   * Adds the locales
   * @param locales locale string[]
   */
  addLocales(locales: string[]): void;

  /**
   *
   * @param locale default locale
   */
  setDefaultLocale(locale: string): void;
}
