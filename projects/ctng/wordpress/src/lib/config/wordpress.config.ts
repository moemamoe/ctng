import { InjectionToken } from '@angular/core';

export const WP_CONFIG = new InjectionToken<WordpressConfig>('WordpressConfig');

export interface WordpressConfig {
  protocoll: string;
  domain: string;
  subDomain?: string;
}
