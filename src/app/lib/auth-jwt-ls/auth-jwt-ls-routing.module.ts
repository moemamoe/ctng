import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthJwtLsComponent } from './auth-jwt-ls.component';

const routes: Routes = [{ path: '', component: AuthJwtLsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthJwtLsRoutingModule { }
