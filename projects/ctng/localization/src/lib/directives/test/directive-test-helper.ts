import { registerLocaleData, DatePipe } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { TestBed } from '@angular/core/testing';
import { spyOnObject, TestHelper, TestMetaData } from '@ctng/testing';
import { localizationTestHelper } from '../../../test/test-helper';
import { LocalizationService } from '../../services';
import { LocalizationDirectiveTestContext } from './localization-directive-test-context';

// registers the german locale data
registerLocaleData(localeDe);

/**
 * Test helper Ngx Default Integration
 */
export const localizationDirectiveTestMetaData: TestMetaData = {
  beforeEach: (testContext: LocalizationDirectiveTestContext<any>) => {
    testContext.localizationServiceSpy = spyOnObject(TestBed.inject(LocalizationService));
  },
};

export const localizationDirectiveTestHelper = new TestHelper([
  ...localizationTestHelper.getCommonTestMetaData(),
  localizationDirectiveTestMetaData,
]);
