import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LOCALIZATION_CONFIG, NgxLocalizationModule } from '@ctng/localization';
import { TranslateLoader } from '@ngx-translate/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class WebpackTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    const content = import(`PATH_TO_TRANSLATION_FOLDER/${lang}.json`);
    return from(content).pipe(
      map(zoneAwarePromise => {
        return zoneAwarePromise.default;
      }),
    );
  }
}

@NgModule({
  declarations: [],
  imports: [CommonModule, NgxLocalizationModule.forRoot()],
  providers: [
    {
      provide: LOCALIZATION_CONFIG,
      useValue: {
        defaultLocale: 'en',
        locales: ['en', 'de'],
      },
    },
    {
      provide: TranslateLoader,
      useClass: WebpackTranslateLoader,
    },
  ],
})
export class AppModule {}
