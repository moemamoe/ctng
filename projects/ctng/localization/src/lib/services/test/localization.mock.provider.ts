import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocaleChangeResult } from '../../interfaces';
import { LocalizationProvider } from '../localization.provider';

@Injectable()
export class LocalizationMockProvider implements LocalizationProvider {
  public get(key: string | string[], interpolateParams: Object): Observable<any> {
    throw Error('Not implemented');
  }

  public use(lang: string): Observable<any> {
    throw Error('Not implemented');
  }

  public onLocaleChange(): Observable<LocaleChangeResult> {
    throw Error('Not implemented');
  }

  public getCurrentLocale(): string {
    throw Error('Not implemented');
  }

  public addLocales(locales: string[]): void {
    throw Error('Not implemented');
  }

  public setDefaultLocale(locale: string): void {
    throw Error('Not implemented');
  }
}
