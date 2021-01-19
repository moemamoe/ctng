/**
 * Wordpress REST API arguments and their mapping
 *
 * key: Identifier to map official Wordpress REST API Strings
 * string value: Wordpress official REST API Strings
 */
export enum WPArguments {
  status = 'status',
  include = 'include[]',
  page = 'page',
  perPage = 'per_page',
  order = 'order',
  orderBy = 'orderby',
  language = 'lang',
}
