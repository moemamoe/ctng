import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthJwtLsRoutingModule } from './auth-jwt-ls-routing.module';
import { AuthJwtLsComponent } from './auth-jwt-ls.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [AuthJwtLsComponent],
  imports: [CommonModule, AuthJwtLsRoutingModule, MarkdownModule.forChild()],
})
export class AuthJwtLsModule {}
