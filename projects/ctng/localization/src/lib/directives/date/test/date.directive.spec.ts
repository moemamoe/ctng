import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { LocaleChangeResult } from '@ctng/localization';
import { Observable, Subject } from 'rxjs';
import { localizationDirectiveTestHelper } from '../../test/directive-test-helper';
import { DateDirectiveTestContext, LocalizationDirectiveTestContext } from '../../test/localization-directive-test-context';
import { DateFormatDirective } from '../date.directive';

/**
 * Wrapper component
 */
@Component({
  template: `
    <p ctDateFormat [date]="date" [format]="format" [todayFormat]="todayFormat"></p>
  `,
})
class DateDirectiveWrapperComponent {
  public date: Date;
  public format: string;
  public todayFormat: string;

  public setDate(value: Date) {
    this.date = value;
  }

  public setFormat(value: string) {
    this.format = value;
  }

  public setTodayFormat(value: string) {
    this.todayFormat = value;
  }
}

describe('Date Format Directive', () => {
  // fake subject and observable to fake locale change event
  const localChangeSubject$ = new Subject<LocaleChangeResult>();
  const localChangeObservable: Observable<LocaleChangeResult> = localChangeSubject$.asObservable();

  // initial locale
  const initialLocale = 'de';

  localizationDirectiveTestHelper.createDirectiveTestSetup(DateFormatDirective, DateDirectiveWrapperComponent, {
    beforeEach: (testContext: LocalizationDirectiveTestContext<any>) => {
      testContext.localizationServiceSpy.getCurrentLocale.and.returnValue(initialLocale);

      testContext.localizationServiceSpy.onLocaleChange.and.callFake(() => {
        return localChangeObservable;
      });
    },
  });

  it('ctDateDirective should initialize without errors, when no values provided', function(this: DateDirectiveTestContext<
    DateFormatDirective,
    DateDirectiveWrapperComponent
  >) {
    // Assert
    expect(this.testedDirective['el'].nativeElement.textContent).toEqual('', 'Unexpected Date format in directive element');

    // Act
    localChangeSubject$.next({ locale: 'en', translations: {} });

    // Assert
    expect(this.testedDirective['el'].nativeElement.textContent).toEqual('', 'Unexpected Date format in directive element');
  });

  it('Initialization and local change should set correct localized default string into element', function(this: DateDirectiveTestContext<
    DateFormatDirective,
    DateDirectiveWrapperComponent
  >) {
    // Arrange
    const now = new Date();

    // Act
    this.hostComponent.setDate(now);
    this.fixture.detectChanges();

    // Assert
    let expectedResult = new DatePipe(initialLocale).transform(now, this.testedDirective.format);
    expect(this.testedDirective['el'].nativeElement.textContent).toEqual(expectedResult, 'Unexpected Date format in directive element');

    // Act
    localChangeSubject$.next({ locale: 'en', translations: {} });

    // Assert
    expectedResult = new DatePipe('en').transform(now, this.testedDirective.format);
    expect(this.testedDirective['el'].nativeElement.textContent).toEqual(expectedResult, 'Unexpected Date format in directive element');
  });

  it(`Initialization and property change should set
      correct localized string with custom format into element`, function(this: DateDirectiveTestContext<
    DateFormatDirective,
    DateDirectiveWrapperComponent
  >) {
    // Arrange
    const now = new Date();
    let format = 'fullTime';

    // Act
    this.hostComponent.setDate(now);
    this.hostComponent.setFormat(format);
    this.fixture.detectChanges();

    // Assert
    let expectedResult = new DatePipe(initialLocale).transform(now, this.testedDirective['_format']);
    expect(this.testedDirective['el'].nativeElement.textContent).toEqual(expectedResult, 'Unexpected Date format in directive element');

    // Act
    localChangeSubject$.next({ locale: 'en', translations: {} });

    // Assert
    expectedResult = new DatePipe('en').transform(now, this.testedDirective['_format']);
    expect(this.testedDirective['el'].nativeElement.textContent).toEqual(expectedResult, 'Unexpected Date format in directive element');

    // Arrange
    format = 'shortTime';

    // Act
    this.hostComponent.setFormat(format);
    this.fixture.detectChanges();

    // Assert
    expectedResult = new DatePipe(initialLocale).transform(now, format);
    expect(this.testedDirective['el'].nativeElement.textContent).toEqual(expectedResult, 'Unexpected Date format in directive element');
  });

  it(`Initialization and property change should set
      correct localized string with cutom todayFormat into element`, function(this: DateDirectiveTestContext<
    DateFormatDirective,
    DateDirectiveWrapperComponent
  >) {
    // Arrange
    const now = new Date();
    const format = 'shortDate';
    let todayFormat = 'fullTime';

    // Act
    this.hostComponent.setTodayFormat(todayFormat);
    this.hostComponent.setFormat(format);
    this.hostComponent.setDate(now);
    this.fixture.detectChanges();

    // Assert
    let expectedResult = new DatePipe(initialLocale).transform(now, todayFormat);
    expect(this.testedDirective['el'].nativeElement.textContent).toEqual(expectedResult, 'Unexpected Date format in directive element');

    // Act
    localChangeSubject$.next({ locale: 'en', translations: {} });

    // Assert
    expectedResult = new DatePipe('en').transform(now, todayFormat);
    expect(this.testedDirective['el'].nativeElement.textContent).toEqual(expectedResult, 'Unexpected Date format in directive element');

    // Arrange
    todayFormat = 'shortTime';

    // Act
    this.hostComponent.setTodayFormat(todayFormat);
    this.fixture.detectChanges();

    // Assert
    expectedResult = new DatePipe(initialLocale).transform(now, todayFormat);
    expect(this.testedDirective['el'].nativeElement.textContent).toEqual(expectedResult, 'Unexpected Date format in directive element');
  });
});
