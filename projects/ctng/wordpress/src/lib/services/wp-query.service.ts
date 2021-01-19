import { Injectable } from '@angular/core';
import { LoggerService } from '@ctng/core';
import { WPArguments } from '../enum/wp-arguments.enum';
import { WPLanguage } from '../enum/wp-language';
import { WPQueryParams } from '../model/wp-query';

@Injectable({
  providedIn: 'root',
})
export class WpQueryService {
  constructor(private loggerService: LoggerService) {}

  /**
   * Maps the query params to a url
   * @param queryParams: WPQueryParams object
   */
  public mapQueryToUrl(queryParams: WPQueryParams): string {
    if (queryParams === 'undefined' || !queryParams) {
      return null;
    }

    let queryParamsString = '?';

    // loop over object of query params and get the url string
    for (const key in queryParams) {
      if (key) {
        queryParamsString += this.getQueryString(key, queryParams[key]);
      }
    }

    // remove last "&" sign, if the url ends with it
    if (queryParamsString.endsWith('&')) {
      queryParamsString = queryParamsString.substring(0, queryParamsString.length - 1);
    }
    return queryParamsString;
  }

  /**
   *
   * @param key: key of query params
   * @param value: value of query
   */
  private getQueryString(key: string, value: any): string {
    let queryParamsString = '';

    switch (key) {
      case 'include':
        value.forEach(id => {
          queryParamsString += WPArguments.include + '=' + id.toString() + '&';
        });
        return queryParamsString;

      case 'status':
        return (queryParamsString += WPArguments.status + '=' + value + '&');
      case 'page':
        return (queryParamsString += WPArguments.page + '=' + value + '&');
      case 'perPage':
        return (queryParamsString += WPArguments.perPage + '=' + value + '&');
      case 'order':
        return (queryParamsString += WPArguments.order + '=' + value + '&');
      case 'orderBy':
        return (queryParamsString += WPArguments.orderBy + '=' + value + '&');
      case 'language':
        return (queryParamsString += WPArguments.language + '=' + WPLanguage[value] + '&');

      default:
        queryParamsString += key.toString() + '=' + value + '&';
        this.logError(`Unknown Query Argument! ${queryParamsString} is used even if this query param could not exist.`);
        return queryParamsString;
    }
  }


  private logError(message: string, ...input: any[]): void {
    this.loggerService.error('[WpQueryService]', message, ...input);
  }
}
