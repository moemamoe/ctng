import { NgModule } from '@angular/core';
import { CommonModule as NgCommon } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './component/core/core.component';
import { MarkdownModule } from 'ngx-markdown';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule as CtCommon } from '@ctng/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    NgCommon,
    MatButtonModule,
    MatInputModule,
    MarkdownModule.forChild(),
    CtCommon,
    CoreRoutingModule,
    FormsModule
  ],
  declarations: [CoreComponent]
})
export class CoreModule { }
