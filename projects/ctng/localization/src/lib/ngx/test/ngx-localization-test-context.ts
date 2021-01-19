import { TranslateService } from '@ngx-translate/core';
import { CommonTestContext } from '../../../test/localization-test-context';

/**
 * Specific Ngx Localization Test Context
 */
export interface NgxLocalizationTestContext<T> extends CommonTestContext<T> {
  translateServiceSpy: jasmine.SpyObj<TranslateService>;
}
