import { LogLevel } from './logLevel';
import { CallerDetail } from './caller-detail';
import { Log } from './log';

export class LoggerUtils {
  static getLog(logLevel: LogLevel, namespace: string, message: string, ...input: any[]): Log {
    return {
      logLevel: logLevel,
      namespace: namespace,
      message: message,
      input: input,
      timestamp: LoggerUtils.getTimeStamp(),
    };
  }

  static getTimeStamp() {
    return new Date().toISOString();
  }

  static prepareMetaString(timestamp: string, logLevel: string, fileName: string, lineNumber: string) {
    const fileDetails = fileName ? ` [${fileName}:${lineNumber}]` : '';

    return `${timestamp} ${logLevel}${fileDetails}`;
  }

  static getColor(level: LogLevel) {
    switch (level) {
      case LogLevel.debug:
        return 'teal';
      case LogLevel.info:
        return 'gray';
      case LogLevel.warning:
        return 'yellow';
      case LogLevel.error:
        return 'red';
      case LogLevel.off:
      default:
        return;
    }
  }

  /**
   *  This allows us to see who called the logger
   */
  static getCallerDetails(): CallerDetail {
    const err = new Error('');

    const callerDetails: CallerDetail = {
      fileName: null,
      lineNumber: null,
      className: null,
    };

    const stackArray = err.stack.split('\n');

    if (!stackArray || stackArray.length < 5) {
      return callerDetails;
    }

    const callerLine = stackArray[4];

    const classMatch = callerLine.match(/(at)\s([\w]+)\./i);

    if (classMatch.length >= 3) {
      callerDetails.className = classMatch[2];
    }

    // this should produce the line which NGX Logger was called
    const callerLineArray = err.stack.split('\n')[4].split('/');

    // returns the file:lineNumber
    if (callerLineArray.length >= 0) {
      const fileLineNumber = callerLineArray[callerLineArray.length - 1].replace(/[)]/, '').split(':');

      callerDetails.fileName = fileLineNumber[0];
      callerDetails.lineNumber = fileLineNumber[1];
    }

    return callerDetails;
  }

  static prepareMessage(message) {
    try {
      if (typeof message !== 'string' && !(message instanceof Error)) {
        message = JSON.stringify(message, null, 2);
      }
    } catch (e) {
      // additional = [message, ...additional];
      message = 'The provided "message" value could not be parsed with JSON.stringify().';
    }

    return message;
  }

  static prepareAdditionalParameters(additional: any[]) {
    if (additional === null || additional === undefined) {
      return null;
    }

    return additional.map((next, idx) => {
      try {
        // We just want to make sure the JSON can be parsed, we do not want to actually change the type
        if (typeof next === 'object') {
          JSON.stringify(next);
        }

        return next;
      } catch (e) {
        return `The additional[${idx}] value could not be parsed using JSON.stringify().`;
      }
    });
  }
}
