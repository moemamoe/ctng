import { inject, TestBed } from '@angular/core/testing';
import { LoggerService, loogerTestConfig } from '@ctng/core';
import * as clonedeep from 'lodash.clonedeep';
import { WordpressMockConfig } from '../../config/test/wordpress.mock.config';
import { WordpressConfig, WP_CONFIG } from '../../config/wordpress.config';
import { RestType, UrlService } from '../url.service';

describe('UrlService', () => {
  let wordpressMockConfig: WordpressConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UrlService, { provide: WP_CONFIG, useValue: clonedeep(WordpressMockConfig) }, LoggerService, loogerTestConfig],
    });

    wordpressMockConfig = TestBed.inject(WP_CONFIG);
  });

  it('should be created', inject([UrlService], (service: UrlService) => {
    expect(service).toBeTruthy();
  }));

  it('getWordpressRestUrl() should return default Url, when configuration is correct', inject([UrlService], (service: UrlService) => {
    let url = service.getWordpressRestUrl();
    expect(url).toEqual(
      `${wordpressMockConfig.protocoll}${wordpressMockConfig.subDomain}.${wordpressMockConfig.domain}${
        service['wordpressRestUrls'][RestType.Rest]
      }`,
      'Unexpected default url from URL Service 1',
    );

    // subdomain ends with "."
    wordpressMockConfig.subDomain = 'test.';
    url = service.getWordpressRestUrl();
    expect(url).toEqual(
      `${wordpressMockConfig.protocoll}${wordpressMockConfig.subDomain}${wordpressMockConfig.domain}${
        service['wordpressRestUrls'][RestType.Rest]
      }`,
      'Unexpected default url from URL Service 2',
    );

    // domain ends with "/"
    wordpressMockConfig.subDomain = 'test';
    wordpressMockConfig.domain = 'test.de';
    url = service.getWordpressRestUrl();
    expect(url).toEqual(
      `${wordpressMockConfig.protocoll}${wordpressMockConfig.subDomain}.test.de${service['wordpressRestUrls'][RestType.Rest]}`,
      'Unexpected default url from URL Service 3',
    );
  }));

  it('getWordpressRestUrl() should return correct Url, when subdomain is missing in configuration', inject(
    [UrlService],
    (service: UrlService) => {
      wordpressMockConfig.subDomain = null;
      const url = service.getWordpressRestUrl();
      expect(url).toEqual(
        `${wordpressMockConfig.protocoll}${wordpressMockConfig.domain}${service['wordpressRestUrls'][RestType.Rest]}`,
        'Unexpected default url from URL Service',
      );
    },
  ));

  it('getWordpressRestUrl() should return null, when configuration is incorrect', inject([UrlService], (service: UrlService) => {
    // wrong protocoll
    wordpressMockConfig.protocoll = 'wrong-protocoll';
    let url = service.getWordpressRestUrl();
    expect(url).toBeNull('Unexpected url from URL Service: should be "null" for wrong protocoll');

    // protocoll missing
    wordpressMockConfig.protocoll = null;
    url = service.getWordpressRestUrl();
    expect(url).toBeNull('Unexpected url from URL Service: should be "null" for wrong protocoll');

    // domain missing
    wordpressMockConfig.protocoll = 'http://';
    wordpressMockConfig.domain = null;
    url = service.getWordpressRestUrl();
    expect(url).toBeNull('Unexpected url from URL Service: should be "null" for wrong protocoll');
  }));

  it('getWordpressAcfRestUrl() should return default Url, when configuration is correct', inject([UrlService], (service: UrlService) => {
    let url = service.getWordpressAcfRestUrl();
    expect(url).toEqual(
      `${wordpressMockConfig.protocoll}${wordpressMockConfig.subDomain}.${wordpressMockConfig.domain}${
        service['wordpressRestUrls'][RestType.AcfRest]
      }`,
      'Unexpected default url from URL Service',
    );

    url = service.getWordpressAcfRestUrl('test');
    expect(url).toEqual(
      `${wordpressMockConfig.protocoll}${wordpressMockConfig.subDomain}.${wordpressMockConfig.domain}${
        service['wordpressRestUrls'][RestType.AcfRest]
      }/test`,
      'Unexpected default url from URL Service',
    );
  }));
});
