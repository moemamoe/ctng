import { Inject, Injectable } from '@angular/core';
import { LocalStorageService, LoggerService, WindowService } from '@ctng/core';
import { Observable } from 'rxjs';
import { LocaleChangeResult } from '../interfaces/locale.change';
import { Localization } from '../interfaces/localization';
import { LocalizationConfig, LOCALIZATION_CONFIG } from '../interfaces/localization.config';
import { LocalizationProvider } from './localization.provider';

@Injectable()
export class LocalizationService implements Localization {
  private logNameSpace = '[LocalizationService]';

  constructor(
    @Inject(LOCALIZATION_CONFIG) private localizationConfig: LocalizationConfig,
    private windowService: WindowService,
    private loggerService: LoggerService,
    private localeStorageService: LocalStorageService,
    private localizationProvider: LocalizationProvider,
  ) {
    if (!this.localizationConfig) {
      throw new Error('No localization config is provided. Please provide the configuration by the InjectionToken "LOCALIZATION_CONFIG"');
    }

    // register locales, if it is implemented in the config
    this.registerLocales();
    // initializes itself
    this.init();
  }

  /**
   * Init function to set all locales
   */
  private init(): void {
    // add locales from the config
    this.addLocales(this.localizationConfig.locales);

    // set default locale
    this.setDefaultLocale(this.localizationConfig.defaultLocale);

    // get initial locale
    const locale = this.getIntialLocale();

    // set the locale
    this.use(locale);
  }

  /**
   * Retuns single translations by key
   * @param key: lang key
   * @param interpolateParams: interpolation params
   */
  public get(key: string | string[], interpolateParams: Object = null): Observable<any> {
    return this.localizationProvider.get(key, interpolateParams);
  }

  /**
   * Main function to switch the locale
   * @param lang: locale string
   */
  public use(locale: string): Observable<any> {
    this.logSilly('Locale locale to: ', locale);
    if (this.localizationConfig.localStorageKey) {
      this.localeStorageService.setItem(this.localizationConfig.localStorageKey, locale);
    }

    return this.localizationProvider.use(locale);
  }

  /**
   * Locale changed event
   */
  public onLocaleChange(): Observable<LocaleChangeResult> {
    return this.localizationProvider.onLocaleChange();
  }

  /**
   * Returns the current locale
   */
  public getCurrentLocale(): string {
    const currentLocale = this.localizationProvider.getCurrentLocale();
    return currentLocale ? currentLocale : this.localizationConfig.defaultLocale;
  }

  /**
   * Adds the locales from the config
   */
  public addLocales(locales: string[]): void {
    this.localizationProvider.addLocales(locales);
    this.logDebug('Locales added from config: ', this.localizationConfig.locales);
  }

  /**
   * Sets the default locale string
   * @param locale: locale stirng
   */
  public setDefaultLocale(locale: string): void {
    this.localizationProvider.setDefaultLocale(locale);
    this.logDebug('Default locale set to: ', locale);
  }

  /**
   * Returns the locale from the window navigator
   */
  private getSupportedLocaleFromWindow(): string {
    const fullLocale = this.windowService.nativeWindow.navigator.language;

    if (this.isLocaleSupported(fullLocale)) {
      return fullLocale;
    }

    const locale = fullLocale.split('-')[0];
    return this.isLocaleSupported(locale) ? locale : null;
  }

  /**
   * Returns the locale from the localstorage
   */
  private getSupportedLocaleFromLocalStorage(): string {
    const locale = this.localeStorageService.getItem(this.localizationConfig.localStorageKey);
    return this.isLocaleSupported(locale) ? locale : null;
  }

  /**
   * Returns the intial locale
   */
  private getIntialLocale(): string {
    let locale = null;

    if (this.localizationConfig.useWindowLocale) {
      locale = this.getSupportedLocaleFromWindow();
    }

    if (this.localizationConfig.localStorageKey) {
      locale = this.getSupportedLocaleFromLocalStorage();
    }

    return locale ? locale : this.localizationConfig.defaultLocale;
  }

  /**
   * Checks if in the config is the locale string
   * @param locale: locale string
   */
  private isLocaleSupported(locale: string): boolean {
    return this.localizationConfig.locales.includes(locale);
  }

  /**
   * Calls the register locale
   */
  private registerLocales(): void {
    if (typeof this.localizationConfig.registerLocales === 'function') {
      this.localizationConfig.registerLocales();
    }
  }

  /**
   * Debug Logging
   */
  private logDebug(message: string, ...input: any[]) {
    this.loggerService.debug(this.logNameSpace, message, input);
  }

  /**
   * Debug Silly
   */
  private logSilly(message: string, ...input: any[]) {
    this.loggerService.debug(this.logNameSpace, message, input);
  }
}
