import { ModuleWithProviders, NgModule } from '@angular/core';
import { DateFormatDirective } from './directives/date/date.directive';
import { LocalizationService } from './services/localization.service';

@NgModule({
  declarations: [DateFormatDirective],
  imports: [],
  exports: [DateFormatDirective],
})
export class LocalizationModule {
  static forRoot(): ModuleWithProviders<LocalizationModule> {
    return {
      ngModule: LocalizationModule,
      providers: [LocalizationService],
    };
  }
}
