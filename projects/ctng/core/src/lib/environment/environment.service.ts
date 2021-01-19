import { Inject, Injectable, InjectionToken } from '@angular/core';
import { TEMP_ENV_STORAGE } from './init-with-env';

/**
 * This factory is the default factory for the EnvironmentService and
 * can be used to pass any static environment to this service
 *
 * @param env: Environment, which should be used by the EnvironmentService (it must be provided by the ENVIRONMENT InjectionToken)
 */
export function EnvironmentFactory(env: any) {
  return new EnvironmentService(env);
}

/**
 * Test Environment Factory for Testing purposes
 */
export function EnvironmentFactoryTest() {
  const env = {};

  return new EnvironmentService(env);
}

/**
 * Environment File Factory to provide a environment to the EnvironmentService from a configuration file,
 * which is fetched by Http request before bootstrapping the application. For this, the app bootstrap in the
 * main.ts file needs to replaced by initAppWithEnvFile() from 'init-with-env.ts'
 */
export function EnvironmentFileFactory() {
  // the environment is written in the window by the initAppWithEnvFile() function
  const env = window[TEMP_ENV_STORAGE];

  if (!env) {
    throw new Error('Env file is missing! Use initAppWithEnvFile() function in main.ts to bootstrap angular');
  }

  window[TEMP_ENV_STORAGE] = null;

  return new EnvironmentService(env);
}

/**
 * Injection Token to provide a Environment
 *
 * Usage: { provide: ENVIRONMENT, useValue: 'anyValueYouWant'}
 */
export const ENVIRONMENT = new InjectionToken<any>('environment');

@Injectable({
  providedIn: 'root',
  useFactory: EnvironmentFactory,
  deps: [ENVIRONMENT],
})
export class EnvironmentService {
  /**
   * @param env: Environment to be used in the application
   */
  constructor(@Inject(ENVIRONMENT) private environment: any) {
    if (!this.environment) {
      throw new Error(
        'Environment object must be defined!!! Provide it either with the "ENVIRONMENT" InjectionToken or with loading a json file (see EnvironmentFileFactory())',
      );
    }
  }

  /**
   * Returns the environment
   */
  public getEnv() {
    return this.environment;
  }
}
