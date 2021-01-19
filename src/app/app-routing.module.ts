import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LayoutComponent } from './layout/components/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/core',
        pathMatch: 'full',
      },
      {
        path: 'core',
        loadChildren: () => import('./lib/core/core.module').then((m) => m.CoreModule),
        data: { title: 'Core Package' },
      },
      {
        path: 'common',
        loadChildren: () => import('./lib/common/common.module').then((m) => m.CommonModule),
        data: { title: 'Common Module' },
      },
      {
        path: 'wordpress',
        loadChildren: () => import('./lib/wordpress/wordpress.module').then((m) => m.WordpressModule),
        data: { title: 'Wordpress Package' },
      },
      {
        path: 'localization',
        loadChildren: () => import('./lib/localization/localization.module').then((m) => m.LocalizationModule),
        data: { title: 'Localization Package' },
      },
      { path: 'auth', loadChildren: () => import('./lib/auth/auth.module').then((m) => m.AuthModule), data: { title: 'Auth Module' } },
      {
        path: 'testing',
        loadChildren: () => import('./lib/test/test.module').then((m) => m.TestModule),
        data: { title: 'Testing Module' },
      },
      {
        path: 'auth-jwt-ls',
        loadChildren: () => import('./lib/auth-jwt-ls/auth-jwt-ls.module').then((m) => m.AuthJwtLsModule),
        data: { title: 'Auth JWT Local Storage' },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/core',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: true,
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
