import { NgModule } from '@angular/core';
import { CommonModule as NgCommon } from '@angular/common';

import { CommonModule as CtCommon} from '@ctng/common';

import { CommonRoutingModule } from './common-routing.module';
import { CommonComponent } from './component/common/common.component';

@NgModule({
  declarations: [CommonComponent],
  imports: [
    NgCommon,
    CtCommon,
    CommonRoutingModule,
  ],
  providers: [
  ]
})
export class CommonModule { }
