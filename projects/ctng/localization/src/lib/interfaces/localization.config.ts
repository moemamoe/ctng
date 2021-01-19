import { InjectionToken } from '@angular/core';

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
