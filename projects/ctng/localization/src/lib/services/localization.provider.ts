import { Observable } from 'rxjs';
import { LocaleChangeResult } from '../interfaces';
import { Localization } from '../interfaces/localization';

export abstract class LocalizationProvider implements Localization {
  public abstract get(key: string | string[], interpolateParams: Object): Observable<any>;
  public abstract use(lang: string): Observable<any>;
  public abstract onLocaleChange(): Observable<LocaleChangeResult>;
  public abstract getCurrentLocale(): string;
  public abstract addLocales(locales: string[]): void;
  public abstract setDefaultLocale(locales: string): void;
}
