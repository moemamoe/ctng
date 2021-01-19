import { LocalizationTestContext } from '../../../test/localization-test-context';
import { localizationTestHelper } from '../../../test/test-helper';
import { LocalizationService } from '../localization.service';

describe('LocalizationService initalization without window and localstorage', () => {
  localizationTestHelper.createServiceTestSetup(LocalizationService, {
    beforeEach: (testContext: LocalizationTestContext<any>) => {
      testContext.localizationProviderSpy.addLocales.and.stub();
      testContext.localizationProviderSpy.setDefaultLocale.and.stub();
      testContext.localizationProviderSpy.use.and.stub();
      testContext.localStorageServiceSpy.setItem.and.stub();
    },
  });

  it(`all expected localization provider functions should be called with the expected values`, function(this: LocalizationTestContext<
    any
  >) {
    expect(this.service).toBeDefined();
    expect(this.localizationProviderSpy.addLocales).toHaveBeenCalled();
    expect(this.localizationProviderSpy.addLocales).toHaveBeenCalledWith(this.localizationConfig.locales);
    expect(this.localizationProviderSpy.setDefaultLocale).toHaveBeenCalled();
    expect(this.localizationProviderSpy.setDefaultLocale).toHaveBeenCalledWith(this.localizationConfig.defaultLocale);
    expect(this.localizationProviderSpy.use).toHaveBeenCalled();
    expect(this.localizationProviderSpy.use).toHaveBeenCalledWith(this.localizationConfig.defaultLocale);
  });
});

describe('LocalizationService initalization with window and without localstorage', () => {
  // mock navigator has "de-DE" --> "de" is supported in the locales
  const expectedLanguage = 'de';

  localizationTestHelper.createServiceTestSetup(LocalizationService, {
    beforeEach: (testContext: LocalizationTestContext<any>) => {
      testContext.localizationProviderSpy.addLocales.and.stub();
      testContext.localizationProviderSpy.setDefaultLocale.and.stub();
      testContext.localizationProviderSpy.use.and.stub();
      testContext.localStorageServiceSpy.setItem.and.stub();

      testContext.localizationConfig.useWindowLocale = true;
    },
  });

  it(`all expected localization provider functions should be called with the expected values`, function(this: LocalizationTestContext<
    any
  >) {
    expect(this.service).toBeDefined();
    expect(this.localizationProviderSpy.setDefaultLocale).toHaveBeenCalled();
    expect(this.localizationProviderSpy.setDefaultLocale).toHaveBeenCalledWith(this.localizationConfig.defaultLocale);
    expect(this.localizationProviderSpy.use).toHaveBeenCalled();
    expect(this.localizationProviderSpy.use).toHaveBeenCalledWith(expectedLanguage);
  });
});

describe('LocalizationService initalization with window and with localstorage', () => {
  const expectedLanguage = 'en';

  localizationTestHelper.createServiceTestSetup(LocalizationService, {
    beforeEach: (testContext: LocalizationTestContext<any>) => {
      testContext.localizationProviderSpy.addLocales.and.stub();
      testContext.localizationProviderSpy.setDefaultLocale.and.stub();
      testContext.localizationProviderSpy.use.and.stub();
      testContext.localStorageServiceSpy.setItem.and.stub();

      testContext.localStorageServiceSpy.getItem.and.returnValue(expectedLanguage);
      testContext.localizationConfig.useWindowLocale = true;
      testContext.localizationConfig.localStorageKey = 'lang';
    },
  });

  it(`all expected localization provider functions should be called with the expected values`, function(this: LocalizationTestContext<
    any
  >) {
    expect(this.service).toBeDefined();
    expect(this.localizationProviderSpy.setDefaultLocale).toHaveBeenCalled();
    expect(this.localizationProviderSpy.setDefaultLocale).toHaveBeenCalledWith(this.localizationConfig.defaultLocale);
    expect(this.localStorageServiceSpy.getItem).toHaveBeenCalledWith(this.localizationConfig.localStorageKey);
    expect(this.localizationProviderSpy.use).toHaveBeenCalled();
    expect(this.localizationProviderSpy.use).toHaveBeenCalledWith(expectedLanguage);
  });
});
