import { DatePipe } from '@angular/common';
import { Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { LoggerService } from '@ctng/core';
import { Subscription } from 'rxjs';
import { LocaleChangeResult } from '../../interfaces/locale.change';
import { LocalizationService } from '../../services';

@Directive({
  selector: '[ctDateFormat]',
})
export class DateFormatDirective implements OnDestroy {
  /**
   * Date Object Setter, which formats the date initially
   */
  @Input() set date(date: Date) {
    this._date = date;

    this.formatValue(this.localizationService.getCurrentLocale());
  }

  /**
   * Angular DatePipe Format (https://angular.io/api/common/DatePipe)
   */
  @Input() set format(format: string) {
    this._format = format;

    this.formatValue(this.localizationService.getCurrentLocale());
  }

  /**
   * (Optionally) Angular DatePipe Format for today (e.g. more detailed)
   */
  @Input() set todayFormat(todayFormat: string) {
    this._todayFormat = todayFormat;

    this.formatValue(this.localizationService.getCurrentLocale());
  }

  // Subscription property for locale change
  private localeSubscription: Subscription;

  // Properties for localization
  private _date: Date;
  private _format: string;
  private _todayFormat: string;

  constructor(private el: ElementRef, private localizationService: LocalizationService, private loggerService: LoggerService) {
    this.localeSubscription = this.localizationService.onLocaleChange().subscribe((lang: LocaleChangeResult) => {
      this.formatValue(lang.locale);
    });
  }

  ngOnDestroy(): void {
    if (this.localeSubscription) {
      this.localeSubscription.unsubscribe();
      this.localeSubscription = null;
    }
  }

  /**
   *Formats the date object to a locale formatted string
   * @param locale: Locale string
   */
  private formatValue(locale?: string) {
    if (!this._date || !(this._date instanceof Date)) {
      this.loggerService.warn(
        '[ctDateDirective]',
        'No valid date object passed to the ctDateFormat Directive. Please provide a valid date object',
      );
      return;
    }

    if (!locale) {
      this.loggerService.warn(
        '[ctDateDirective]',
        'No locale provided to localize date object. Date object can only be localized, when locale is provided.',
      );
      return;
    }

    const now = new Date();

    if (
      this._todayFormat &&
      this._date.getFullYear() === now.getFullYear() &&
      this._date.getMonth() === now.getMonth() &&
      this._date.getDate() === now.getDate()
    ) {
      // Show todayFormat if it is today
      this._format = this._todayFormat;
    }

    // create localized and formated date string from given date and show it
    try {
      const value = new DatePipe(locale).transform(this._date, this._format);
      this.el.nativeElement.textContent = value;
    } catch (error) {
      this.el.nativeElement.textContent = '';
      throw new Error(
        `Formatting the date with Angular Date Pipe failed. Probably because of missing locale data.
        Implement registerLocales() callback function to registerLocaleData(localeData)
        with necessary localeData object from @angular/common/locales in localizationConfig
        ${error}`,
      );
    }
  }
}
