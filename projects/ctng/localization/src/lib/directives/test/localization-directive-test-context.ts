import { DatePipe } from '@angular/common';
import { DirectiveTestContext } from '@ctng/testing';
import { LocalizationTestContext } from '../../../test/localization-test-context';
import { LocalizationService } from '../../services';

export interface LocalizationDirectiveTestContext<T> extends LocalizationTestContext<T> {
  localizationServiceSpy: jasmine.SpyObj<LocalizationService>;
}

export interface DateDirectiveTestContext<T, H> extends DirectiveTestContext<T, H> {}
