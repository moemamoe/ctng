import { Injectable } from '@angular/core';
import { LoggerService } from '@ctng/core';
import { getStatusText, InMemoryDbService, RequestInfo, ResponseOptions, STATUS } from 'angular-in-memory-web-api';
import * as CryptoJS from 'crypto-js';
import { Token } from '../auth/jwt.config';

@Injectable()
export class ApiMock extends InMemoryDbService {
  private readonly logName = '[ApiMock]';
  private mockWarningShown = false;

  constructor(private loggerService: LoggerService) {
    super();
  }

  createDb() {
    return {};
  }

  post(reqInfo: RequestInfo) {
    if (!this.mockWarningShown) {
      this.loggerService.warn(this.logName, 'Intercepting API calls and returning mock data');
      this.mockWarningShown = true;
    }

    if (reqInfo.url.includes('login')) {
      const body = reqInfo.req['body'];

      if (body.user === 'admin' && body.password === 'secret') {
        const jwt = this.getJwt();
        this.loggerService.debug(this.logName, 'Successful login, creating jwt...', jwt);
        return this.createGetResponse(reqInfo, {
          jwt: jwt,
        });
      } else {
        this.loggerService.debug(this.logName, 'Failed login try', reqInfo);
        return this.createGetResponse(reqInfo, { error: 'Wrong user or password' }, STATUS.UNAUTHORIZED);
      }
    }
    if (reqInfo.url.includes('refreshtoken')) {
      const jwt = this.getJwt();
      this.loggerService.debug(this.logName, 'Refreshing token...', jwt);
      return this.createGetResponse(reqInfo, {
        jwt: jwt,
      });
    }
  }

  /**
   * Get basic success response for getting data
   */
  private createGetResponse(reqInfo: RequestInfo, data: any, status: number = STATUS.OK) {
    return reqInfo.utils.createResponse$(() => {
      const dataEncapsulation = reqInfo.utils.getConfig().dataEncapsulation;

      const options: ResponseOptions = {
        status: status,
      };

      if (data) {
        options.body = dataEncapsulation ? { data } : data;
      }

      options.statusText = getStatusText(options.status);
      options.headers = reqInfo.headers;
      options.url = reqInfo.url;

      return options;
    });
  }

  private getJwt() {
    var header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    // Give it a small exp time for testing
    const expDate = new Date();
    expDate.setMinutes(expDate.getMinutes() + 2);

    var data: Token = {
      expirationDate: expDate.getTime(),
    };

    // var secret = 'My very confidential secret!!!';

    var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    var encodedHeader = this.base64url(stringifiedHeader);

    var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    var encodedData = this.base64url(stringifiedData);

    var signature = encodedHeader + '.' + encodedData;
    /* signature = CryptoJS.HmacSHA256(signature, secret);
    signature = this.base64url(signature); */
    return signature;
  }

  private base64url(source) {
    // Encode in classical base64
    let encodedSource = CryptoJS.enc.Base64.stringify(source);

    // Remove padding equal characters
    encodedSource = encodedSource.replace(/=+$/, '');

    // Replace characters according to base64url specifications
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');

    return encodedSource;
  }
}
