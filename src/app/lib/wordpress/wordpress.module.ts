import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WordpressRoutingModule } from './wordpress-routing.module';
import { WordpressComponent } from './component/wordpress/wordpress.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [WordpressComponent],
  imports: [
    CommonModule,
    MarkdownModule.forChild(),
    WordpressRoutingModule
  ]
})
export class WordpressModule { }
