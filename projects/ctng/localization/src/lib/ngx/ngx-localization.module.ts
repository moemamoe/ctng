import { HttpClient } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LocalizationConfig, LOCALIZATION_CONFIG } from '../interfaces';
import { LocalizationModule } from '../localization.module';
import { LocalizationProvider } from '../services/localization.provider';
import { NgxLocalizationProvider } from './services/ngx-localization.provider';

/**
 * Factory for fetching locale file by Http Request
 * @param http: Angular Http Client
 */
export function HttpLoaderFactory(http: HttpClient, localizationConfig: LocalizationConfig): TranslateLoader {
  if (!localizationConfig.httpLocaleFolder) {
    throw new Error(
      'No folder configured, where the localization files are. Please set folder location in localization config as "httpLocaleFolder"',
    );
  }
  return new TranslateHttpLoader(
    http,
    localizationConfig.httpLocaleFolder,
    localizationConfig.httpParameterHash ? `.json?hash=${localizationConfig.httpParameterHash}` : '.json',
  );
}

@NgModule({
  declarations: [],
  imports: [LocalizationModule, TranslateModule],
  exports: [LocalizationModule, TranslateModule],
})
export class NgxLocalizationModule {
  static forRoot(): ModuleWithProviders<NgxLocalizationModule> {
    return {
      ngModule: NgxLocalizationModule,
      providers: [
        ...LocalizationModule.forRoot().providers,
        ...TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient, LOCALIZATION_CONFIG],
          },
        }).providers,
        { provide: LocalizationProvider, useClass: NgxLocalizationProvider },
      ],
    };
  }
}
