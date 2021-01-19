import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WPPost } from '../model/wp-post';
import { WPQueryParams } from '../model/wp-query';
import { UrlService } from './url.service';
import { WpQueryService } from './wp-query.service';
import { WPLanguage } from '../enum/wp-language';

@Injectable({
  providedIn: 'root',
})
export class WPDataService {
  constructor(private http: HttpClient, private urlService: UrlService, private queryService: WpQueryService) {}

  public getOption<T>(option: string, lang?: WPLanguage): Observable<T> {
    const language = lang ? WPLanguage[lang] : null;
    const url = language ?
      `${this.urlService.getWordpressAcfRestUrl(option)}?lang=${language}` :
      this.urlService.getWordpressAcfRestUrl(option);
    return this.http.get<T>(url);
  }

  /**
   * Returns a list of posts as observable
   * @param queryArgs: WPQueryParams object (optional)
   */
  public getPosts<T extends WPPost>(queryArgs: WPQueryParams = null): Observable<T[]> {
    return this.get<T[]>('posts', queryArgs);
  }

  /**
   * Returns a list of pages as observable
   * @param queryArgs: WPQueryParams object (optional)
   */
  public getPages<T extends WPPost>(queryArgs: WPQueryParams = null): Observable<T[]> {
    return this.get<T[]>('pages', queryArgs);
  }

  /**
   * Returns a list of Posts of the given custom post type
   * @param customType: Custom post type slug
   * @param queryArgs: WPQueryParams object (optional)
   */
  public getCustomPosts<T extends WPPost>(customType: string, queryArgs: WPQueryParams = null): Observable<T[]> {
    return this.get<T[]>(customType, queryArgs);
  }

  /**
   *
   * @param customType: Custom post type slug
   * @param id: ID of the custom Post
   * @param queryArgs: WPQueryParams object (optional)
   */
  public getCustomPostById<T extends WPPost>(customType: string, id: number, queryArgs: WPQueryParams = null): Observable<T> {
    return this.get<T>(customType, queryArgs, id);
  }

  /**
   * Generic Getter to the Wordpress Endpoint
   * @param type: Type of Data (Post Type, Page, Post)
   * @param queryArgs: WPQueryParams object (optional)
   * @param id: ID of the post (optional)
   */
  private get<T>(type: string, queryArgs: WPQueryParams = null, id: number = null): Observable<T> {
    let url = this.urlService.getWordpressRestUrl(type);

    if (id !== null) {
      url = Location.joinWithSlash(url, id.toString());
    }

    if (queryArgs !== null) {
      url += this.queryService.mapQueryToUrl(queryArgs);
    }

    return this.http.get<T>(url, {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    });
  }

  /**
   * Post to Endpoint
   * @param endpoint: Rest Endpoint
   * @param data: Post Data
   */
  public post(endpoint: string, data: any): Observable<Object> {
    return this.http.post<Object>(endpoint, data);
  }
}
