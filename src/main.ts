import { enableProdMode } from '@angular/core';
import { initAppWithEnvFile } from '@ctng/core';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

if (environment.production) {
  enableProdMode();
}

// initAppWithEnvFile(AppModule);
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
