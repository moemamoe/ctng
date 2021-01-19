import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LOCALIZATION_CONFIG, NgxLocalizationModule } from '@ctng/localization';

/**
 * Minimum configuration
 */
@NgModule({
  declarations: [],
  imports: [CommonModule, NgxLocalizationModule.forRoot()],
  providers: [
    {
      provide: LOCALIZATION_CONFIG,
      useValue: {
        defaultLocale: 'en',
        locales: ['en', 'de'],
        httpLocaleFolder: '/assets/i18n/',
      },
    },
  ],
})
export class AppModule {}
