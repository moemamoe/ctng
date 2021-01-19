import { LocalStorageService } from '@ctng/core';
import { ServiceTestContext } from '@ctng/testing';
import { LocalizationConfig } from '../lib/interfaces';
import { LocalizationProvider } from '../lib/services';

/**
 * Common Localization Test Context
 */
export interface CommonTestContext<T> extends ServiceTestContext<T> {
  localizationConfig: LocalizationConfig;
}

/**
 * Specific Localization Test Context
 */
export interface LocalizationTestContext<T> extends CommonTestContext<T> {
  localizationProviderSpy: jasmine.SpyObj<LocalizationProvider>;
  localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
}
