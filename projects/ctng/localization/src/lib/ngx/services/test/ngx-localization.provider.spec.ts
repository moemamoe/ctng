import { of } from 'rxjs';
import { LocaleChangeResult } from '../../../interfaces';
import { NgxLocalizationTestContext } from '../../test/ngx-localization-test-context';
import { ngxLocalizationTestHelper } from '../../test/ngx-test-helper';
import { NgxLocalizationProvider } from '../ngx-localization.provider';

// translation testing data
const translations: any = {
  test_string_1: 'This is a test',
  test_string_2: 'This is a test',
  test_string_3: 'This is a test',
  test_string_4: 'This is a test',
  test_string_5: 'This is a test',
};

describe('NgxLocalizationProvider ', () => {
  ngxLocalizationTestHelper.createServiceTestSetup(NgxLocalizationProvider);

  it(`getCurrentLocale() should return correct locale from Ngx Implementation`, function(this: NgxLocalizationTestContext<
    NgxLocalizationProvider
  >) {
    // Arrange
    const expectedLocale = 'de';
    this.translateServiceSpy.currentLang = expectedLocale;

    // Act
    let locale = this.service.getCurrentLocale();

    // Assert
    expect(locale).toEqual(expectedLocale, 'Unexpted locale returned from Ngx Implementation');

    // Arrange
    this.translateServiceSpy.currentLang = undefined;
    this.translateServiceSpy.defaultLang = expectedLocale;

    // Act
    locale = this.service.getCurrentLocale();

    // Assert
    expect(locale).toEqual(expectedLocale, 'Unexpted locale returned from Ngx Implementation');

    // Arrange
    this.translateServiceSpy.currentLang = undefined;
    this.translateServiceSpy.defaultLang = undefined;

    // Act
    locale = this.service.getCurrentLocale();

    // Assert
    expect(locale).toBeNull('Unexpted locale returned from Ngx Implementation');
  });

  it(`addLocales() should should add locales to Ngx Implementation`, function(this: NgxLocalizationTestContext<NgxLocalizationProvider>) {
    // Arrange
    const expectedLocales = ['de', 'en'];

    // Act
    this.service.addLocales(expectedLocales);

    // Assert
    expect(this.translateServiceSpy.addLangs).toHaveBeenCalledTimes(1);
    expect(this.translateServiceSpy.addLangs).toHaveBeenCalledWith(expectedLocales);
  });

  it(`setDefaultLocale() should set default locale to Ngx Implementation`, function(this: NgxLocalizationTestContext<
    NgxLocalizationProvider
  >) {
    // Arrange
    const expectedDefaultLocale = 'de';

    // Act
    this.service.setDefaultLocale(expectedDefaultLocale);

    // Assert
    expect(this.translateServiceSpy.setDefaultLang).toHaveBeenCalledTimes(1);
    expect(this.translateServiceSpy.setDefaultLang).toHaveBeenCalledWith(expectedDefaultLocale);
  });

  it(`use() should set locale to Ngx Implementation`, function(this: NgxLocalizationTestContext<NgxLocalizationProvider>) {
    // Arrange
    const expectedUseLocale = 'de';

    // Act
    this.service.use(expectedUseLocale);

    // Assert
    expect(this.translateServiceSpy.use).toHaveBeenCalledTimes(1);
    expect(this.translateServiceSpy.use).toHaveBeenCalledWith(expectedUseLocale);
  });

  it(`get() should return translations from Ngx Implementation`, function(this: NgxLocalizationTestContext<NgxLocalizationProvider>) {
    this.translateServiceSpy.get.and.returnValue(of(translations['test_string_1']));

    // Act
    this.service.get('test_string_1').subscribe(trans => {
      // Assert
      expect(trans).toEqual(translations['test_string_1'], 'Unexpected locale in get translation by key');
      expect(this.translateServiceSpy.get).toHaveBeenCalledTimes(1);
      expect(this.translateServiceSpy.get).toHaveBeenCalledWith('test_string_1', null);
    });
  });

  it(`onLocaleChanged() should emit correct event from Ngx Implementation`, function(this: NgxLocalizationTestContext<
    NgxLocalizationProvider
  >) {
    // Arrange
    const expectedLocale = 'de';
    spyOnProperty(this.translateServiceSpy, 'onLangChange').and.returnValue(
      of({
        lang: expectedLocale,
        translations: translations,
      }),
    );

    // Act
    this.service.onLocaleChange().subscribe((localeChangeEvent: LocaleChangeResult) => {
      // Assert
      expect(localeChangeEvent.locale).toEqual(expectedLocale, 'Unexpected locale in onLocaleChanged event');
      expect(localeChangeEvent.translations).toEqual(translations, 'Unexpected translations in onLocaleChanged event');
    });
  });
});
