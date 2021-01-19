import { Location } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { WordpressConfig, WP_CONFIG } from '../config/wordpress.config';
import { LoggerService } from '@ctng/core';

/**
 * Rest Types for different REST API urls
 */
export enum RestType {
  Rest,
  AcfRest,
  None,
}

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  private wordpressRestUrls = {
    [RestType.Rest]: '/wp-json/wp/v2/',
    [RestType.AcfRest]: '/wp-json/acf/v3/options/options',
  };

  constructor(@Inject(WP_CONFIG) private config: WordpressConfig, private loggerService: LoggerService) {
    // check the domain settings
    if (this.checkDomainSettings(true)) {
      // inform about the urls
      this.logInfo(`Domain Url set to ${this.getBaseUrl()}`);
      this.logInfo(`Wordpress REST API Url set to ${this.getWordpressRestUrl()}`);
    }
  }

  /**
   * Returns the Url to a specific
   * @param apendix: Apendix for the endpoint (e.g. "posts", "pages", ...)
   */
  public getWordpressRestUrl(apendix: string = null): string {
    return this.constructUrl(apendix, RestType.Rest);
  }

  /**
   * Returns the Url to a specific
   * @param apendix: Apendix for the endpoint (e.g. "posts", "pages", ...)
   */
  public getWordpressAcfRestUrl(apendix: string = null): string {
    return this.constructUrl(apendix, RestType.AcfRest);
  }

  /**
   * Returns the Base Url of the Wordpress Site
   */
  public getBaseUrl(): string {
    return this.constructUrl(null);
  }

  /**
   *
   * @param apendix: Apendix for the endpoint (e.g. "posts", "pages", ...)
   * @param restAPi: Boolean, if it should return the REST API Url or the Base Wordpress URL
   */
  private constructUrl(apendix: string, restType: RestType = RestType.None): string {
    // check the domain settings
    if (!this.checkDomainSettings()) {
      return null;
    }

    // construct the base domain url
    let domainUrl = this.getDomainUrl(this.config.protocoll, this.config.domain, this.config.subDomain);

    // append Wordpress REST API Endpoint
    if (restType !== RestType.None) {
      domainUrl = Location.joinWithSlash(domainUrl, this.wordpressRestUrls[restType]);
    }

    // append appendix
    if (apendix !== null) {
      domainUrl = Location.joinWithSlash(domainUrl, apendix);
    }

    return domainUrl;
  }

  /**
   * Checks the domain settings from the Wordpress Configuration
   * @param logError: boolean for printing error
   */
  private checkDomainSettings(logError: boolean = false): boolean {
    if (typeof this.config.protocoll === 'undefined' || !this.config.protocoll) {
      if (logError) {
        this.logError('Protocoll variable missing in Wordpress Configuration!!!');
      }
      return false;
    }

    if (this.config.protocoll.localeCompare('http://') !== 0 && this.config.protocoll.localeCompare('https://') !== 0) {
      if (logError) {
        this.logError('Protocoll variable is wrong!!! Please provide "http://" oder "https://"');
      }
      return false;
    }

    if (typeof this.config.domain === 'undefined' || !this.config.domain) {
      if (logError) {
        this.logError('Domain variable missing in Wordpress Configuration!!!');
      }
      return false;
    }

    return true;
  }

  /**
   * Constructs the Base Domain Url
   * @param protocoll: Protocoll variable
   * @param domain: Domain variable
   * @param subdomain: Subdomain variable
   */
  private getDomainUrl(protocoll: string, domain: string, subdomain: string): string {
    let domainUrl: string = null;

    if (typeof subdomain === 'undefined' || !subdomain) {
      domainUrl = `${protocoll}${domain}`;
    } else {
      if (subdomain.endsWith('.')) {
        subdomain = subdomain.substring(0, subdomain.length - 1);
      }
      domainUrl = `${protocoll}${subdomain}.${domain}`;
    }

    return domainUrl;
  }

  private logInfo(message: string, ...input: any[]): void {
    this.loggerService.info('[UrlService]', message, ...input);
  }

  private logError(message: string, ...input: any[]): void {
    this.loggerService.error('[UrlService]', message, ...input);
  }
}
