import { WPOrder } from '../enum/wp-order.enum';
import { WPLanguage } from '../enum/wp-language';

/**
 * WP Query Params Object
 *
 * Wordpress query arguments
 *
 * Do not change the property names, because they will be mapped in the wp-query.service.ts
 */
export interface WPQueryParams {
  status?: string;
  include?: number[];
  page?: number;
  perPage?: number;
  order?: WPOrder;
  orderBy?: string;
  language?: WPLanguage;
}
