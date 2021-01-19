import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './components/auth/auth.component';
import { ProtectedComponent } from './components/protected/protected.component';
import { PublicComponent } from './components/public/public.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [AuthComponent, ProtectedComponent, PublicComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MarkdownModule.forChild(),
  ],
  providers: [],
})
export class AuthModule {}
