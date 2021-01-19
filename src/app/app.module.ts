import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from '@ctng/auth';
import { CONSOLE_LOGGER_CONFIG, ENVIRONMENT } from '@ctng/core';
import { WP_CONFIG } from '@ctng/wordpress';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from 'src/environments/environment';
import { ApiMock } from './api/api.mock';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { authProviders } from './auth/auth.providers';
import { LayoutModule } from './layout/layout.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    LayoutModule,
    AppRoutingModule,
    AuthModule,
    HttpClientInMemoryWebApiModule.forRoot(ApiMock, {
      apiBase: 'api',
      passThruUnknownUrl: true,
      delay: 400,
    }),
  ],
  providers: [
    { provide: CONSOLE_LOGGER_CONFIG, useValue: { logLevel: 5 } },
    { provide: WP_CONFIG, useValue: { protocoll: 'http://', domain: 'localhost:8080' } },
    authProviders,
    { provide: ENVIRONMENT, useValue: environment },
    // { provide: EnvironmentService, useFactory: EnvironmentFileFactory },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
