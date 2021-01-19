import { TestBed } from '@angular/core/testing';
import { CONSOLE_LOGGER_CONFIG, LocalStorageService, loogerTestConfig, WindowService, WindowServiceMock } from '@ctng/core';
import { spyOnObject, TestHelper, TestMetaData } from '@ctng/testing';
import { LocalizationConfig, LOCALIZATION_CONFIG } from '../lib/interfaces';
import { LocalizationModule } from '../lib/localization.module';
import { LocalizationProvider } from '../lib/services/localization.provider';
import { LocalizationMockProvider } from '../lib/services/test/localization.mock.provider';
import { LocalizationTestContext } from './localization-test-context';

/**
 * We use a factory, otherwise tests are messing with each other when changing the config.
 * By using the factory we make sure that every test gets its own instance.
 */
const localizationConfigFactory = (): LocalizationConfig => {
  return {
    defaultLocale: 'de',
    locales: ['de', 'en'],
  };
};

/**
 * Basic testing setup used by all unit test setups
 */
export const commonTestMetaData: TestMetaData = {
  providers: [
    { provide: CONSOLE_LOGGER_CONFIG, useValue: loogerTestConfig },
    {
      provide: WindowService,
      useClass: WindowServiceMock,
    },
    {
      provide: LOCALIZATION_CONFIG,
      useFactory: localizationConfigFactory,
    },
  ],
};

/**
 * Global localization test helper
 */
export const localizationTestMetaData: TestMetaData = {
  providers: [{ provide: LocalizationProvider, useClass: LocalizationMockProvider }],
  imports: [LocalizationModule.forRoot()],
  beforeEach: (testContext: LocalizationTestContext<any>) => {
    testContext.localizationConfig = TestBed.inject(LOCALIZATION_CONFIG);
    testContext.localizationProviderSpy = spyOnObject(TestBed.inject(LocalizationProvider));
    testContext.localStorageServiceSpy = spyOnObject(TestBed.inject(LocalStorageService));
  },
};

export const localizationTestHelper = new TestHelper([commonTestMetaData, localizationTestMetaData]);
