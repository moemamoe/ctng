import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgxLocalizationModule } from '@ctng/localization';
import { MarkdownModule } from 'ngx-markdown';
import { LocalizationComponent } from './component/localization.component';
import { localizationProviders } from './config/localization';
import { LocalizationRoutingModule } from './localization-routing.module';

@NgModule({
  declarations: [LocalizationComponent],
  imports: [CommonModule, NgxLocalizationModule.forRoot(), MatButtonModule, MarkdownModule.forChild(), LocalizationRoutingModule],
  providers: [localizationProviders],
})
export class LocalizationModule {}
