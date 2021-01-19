import { LogLevel } from './logLevel';

export interface Log {
  logLevel: LogLevel;
  namespace: string;
  message: string;
  input: any[];
  timestamp: string;
}
