import { LoggerUtils } from '../../logger.utils';
import { LogLevel } from '../../logLevel';

export const testLogsDebug = [
  LoggerUtils.getLog(LogLevel.debug, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.debug, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.debug, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.debug, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.debug, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.debug, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.debug, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.debug, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.debug, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.debug, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.debug, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.debug, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.debug, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.debug, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.debug, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.debug, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.debug, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.debug, 'test', 'test message'),
];

export const testLogsSilly = [
  LoggerUtils.getLog(LogLevel.silly, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.silly, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.silly, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.silly, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.silly, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.silly, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.silly, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.silly, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.silly, 'test', 'test message'),
];

export const testLogsInfo = [
  LoggerUtils.getLog(LogLevel.info, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.info, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.info, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.info, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.info, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.info, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.info, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.info, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.info, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.info, 'test', 'test message'),
];

export const testLogsWarning = [
  LoggerUtils.getLog(LogLevel.warning, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.warning, 'test', 'test message'),
  LoggerUtils.getLog(LogLevel.warning, 'test', 'test message'),
];

export const testLogError = LoggerUtils.getLog(LogLevel.error, 'test', 'test message');

export const testLogsMixed = testLogsDebug.concat(testLogsSilly, testLogsInfo, testLogsWarning);
