import { TestHelper } from '@ctng/testing';
import { CONSOLE_LOGGER_CONFIG } from '@ctng/core';

const commonTestProviders = [{ provide: CONSOLE_LOGGER_CONFIG, useValue: { logLevel: 0 } }];

export const testHelper = new TestHelper([
  {
    providers: commonTestProviders,
  },
]);
