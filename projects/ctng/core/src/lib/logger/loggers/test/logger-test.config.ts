import { CONSOLE_LOGGER_CONFIG } from '../console-logger.config';
import { LogLevel } from '../../logLevel';

export const loogerTestConfig = {
  provide: CONSOLE_LOGGER_CONFIG,
  useValue: {
    logLevel: LogLevel.error,
  },
};
