# Wordpress Package

<section>

## Installation
------

Run `npm install @ctng/wordpress`. The services of the Wordpress Module are `providedIn: 'root'`. There is no module to import. Just inject the services in components, services, pipes or something else.

</section>

<section>

## Configuration
------

The Wordpress Package needs a configuration, which can be provided by the InjectionToken `WP_CONFIG` (see below). 

```typescript
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: WP_CONFIG, useValue: { protocoll: 'http://', domain: 'localhost:8080' } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

The configuration is defined by the WordpressConfig interface:

```typescript 
export interface WordpressConfig {
  protocoll: string;
  domain: string;
  subDomain?: string;
}
```

</section>

<section>

## Services
------

The package contains the following services:

### WPDataService
------

This is the main service to fetch / set data from / to Wordpress.

#### getOption<T>(option: string, lang?: string): Observable<T>

option: This is the name of the acf option fields as string  
lang(optional): WPLanguage enum, which defines the language to fetch

**return: Observable of the option**

#### getPosts<T extends WPPost>(queryArgs: WPQueryParams = null): Observable<T[]>

queryArgs(optional): WPQueryParams object for specific query parameters in Wordpress  

**return: Observable of the posts as list**

#### getPages<T extends WPPost>(queryArgs: WPQueryParams = null): Observable<T[]>

queryArgs(optional): WPQueryParams object for specific query parameters in Wordpress  

**return: Observable of the pages as list**

#### getCustomPosts<T extends WPPost>(customType: string, queryArgs: WPQueryParams = null): Observable<T[]>

customType: Name of the custom post type  
queryArgs(optional): WPQueryParams object for specific query parameters in Wordpress  

**return: Observable of the posts as list**

#### getCustomPostById<T extends WPPost>(customType: string, id: number, queryArgs: WPQueryParams = null): Observable<T>

customType: Name of the custom post type  
id: ID of specific post  
queryArgs(optional): WPQueryParams object for specific query parameters in Wordpress  

**return: Observable of the post**

### WpQueryService
------

This service maps the `WPQueryParams` object to the request url of wordpress. This services is normally not needed outside of the `WPDataService`.

#### mapQueryToUrl(queryParams: WPQueryParams): string

queryArgs: WPQueryParams object for specific query parameters in Wordpress  

**return: Wordpress query url based on the `WordpressConfig` and the given `WPQueryParams`**

### UrlService
------

This service returns urls, which are needed for fetching data from Wordpress. The urls are constructed based on the `WordpressConfig` and the Wordpress Rest Urls.

#### getBaseUrl(): string

**return: Base url of the Wordpress domain**

#### getWordpressRestUrl(apendix: string = null): string

appendix(optional): Appendix for the Endpoint (e.g. posts, pages, ...)

**return: The Rest endpoint of Wordpress**

#### getWordpressAcfRestUrl(apendix: string = null): string

appendix(optional): Appendix for the Endpoint

**return: The ACF Rest endpoint of Wordpress**

</section>

<section>

## Models
------

The following interfaces are defined based on the Wordpress model

### WPPost

This contains all fields of a Wordpress post

### WPQueryParams

This interface contains the most used query params for fetching data from Wordpress

```typescript
export interface WPQueryParams {
  status?: string;
  include?: number[];
  page?: number;
  perPage?: number;
  order?: WPOrder;
  orderBy?: string;
  language?: WPLanguage;
}
```

### WPImage

Contains all fields for a Wordpress image

### WPLinkedPost

Contains fields for a fields, which is linked to another post

</section>

<section>

## Query Enums
------

### WPLanguage

Defines the language, which should be fetched

### WPOrder

Defines the order for sorting the posts (e.g. ascending)

</section>
