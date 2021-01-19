import { Type } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

/**
 * Key for the temporary window environment object
 */
export const TEMP_ENV_STORAGE = 'tempEnvStorage';

/**
 * Initializes the application with pre-fetching a environment file, before bootstrapping the application
 *
 * @param appModule: App module to be bootstraped (Normally it will be the AppModule of the Application)
 * @param envFileLocation: File location of a JSON environment file, which should be used (default: '/assets/env.json')
 * @param errorCallback: Error callback function on failed file fetch or module bootstrap
 */
export function initAppWithEnvFile(
  appModule: Type<{}>,
  envFileLocation: string = '/assets/env.json',
  errorCallback: (any) => void = value => console.error('bootstrap-fail', value),
) {
  // We fetch the env before angular bootstraps
  fetch(envFileLocation)
    .then(response => response.json())
    .then(env => {
      // Stop here, when no environment is availabe: the application needs the environment to work properly
      if (!env) {
        errorCallback(env);
        return;
      }

      // store the environment temporarily in the window
      window[TEMP_ENV_STORAGE] = env;

      // bootstrap the module with angular
      platformBrowserDynamic()
        .bootstrapModule(appModule)
        .catch(errorCallback);
    })
    .catch(errorCallback);
}
