import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LocalizationModule, LocalizationProvider, LOCALIZATION_CONFIG } from '@ctng/localization';
import { LocalizationMockProvider } from '../src/lib/services/test/localization.mock.provider';

/**
 * Minimum configuration
 */
@NgModule({
  declarations: [],
  imports: [CommonModule, LocalizationModule.forRoot()],
  providers: [
    {
      provide: LOCALIZATION_CONFIG,
      useValue: {
        defaultLocale: 'en',
        locales: ['en', 'de'],
      },
    },
    { provide: LocalizationProvider, useClass: LocalizationMockProvider },
  ],
})
export class AppModule {}
