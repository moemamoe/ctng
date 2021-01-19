/*
 * Public API Surface of wordpress
 */

// CONFIG
export { WP_CONFIG, WordpressConfig } from './lib/config/wordpress.config';

// SERVICES
export { UrlService } from './lib/services/url.service';
export { WpQueryService } from './lib/services/wp-query.service';
export { WPDataService } from './lib/services/wp-data.service';

// MODEL
export { WPImage } from './lib/model/wp-image';
export { WPLanguage } from './lib/enum/wp-language';
export { WPLinkedPost } from './lib/model/wp-linked-post';
export { WPPost } from './lib/model/wp-post';
export { WPQueryParams } from './lib/model/wp-query';

// ENUMS
export { WPOrder } from './lib/enum/wp-order.enum';
export { WPArguments } from './lib/enum/wp-arguments.enum';



