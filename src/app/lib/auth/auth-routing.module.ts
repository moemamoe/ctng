import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './components/auth/auth.component';
import { PublicComponent } from './components/public/public.component';
import { ProtectedComponent } from './components/protected/protected.component';
import { ProtectedGuard, PublicGuard } from '@ctng/auth';

const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'public', component: PublicComponent, canActivate: [PublicGuard] },
  { path: 'protected', component: ProtectedComponent, canActivate: [ProtectedGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
