import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { spyOnObject, TestHelper, TestMetaData } from '@ctng/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { commonTestMetaData } from '../../../test/test-helper';
import { LOCALIZATION_CONFIG } from '../../interfaces';
import { LocalizationProvider } from '../../services';
import { NgxLocalizationModule } from '../ngx-localization.module';
import { NgxLocalizationProvider } from '../services/ngx-localization.provider';
import { NgxIntegrationTestContext } from './ngx-integration-test-context';
import { NgxLocalizationTestContext } from './ngx-localization-test-context';

/**
 * Test helper for Ngx Localization provider only
 */
export const ngxLocalizationTestMetaData: TestMetaData = {
  providers: [NgxLocalizationProvider],
  imports: [TranslateModule.forRoot(), HttpClientTestingModule],
  beforeEach: (testContext: NgxLocalizationTestContext<any>) => {
    testContext.translateServiceSpy = spyOnObject(TestBed.inject(TranslateService));
  },
};

export const ngxLocalizationTestHelper = new TestHelper([commonTestMetaData, ngxLocalizationTestMetaData]);

/**
 * Test helper Ngx Default Integration
 */
export const ngxIntegrationTestMetaData: TestMetaData = {
  providers: [{ provide: LocalizationProvider, useClass: NgxLocalizationProvider }],
  imports: [NgxLocalizationModule.forRoot(), HttpClientTestingModule],
  beforeEach: (testContext: NgxIntegrationTestContext<any>) => {
    testContext.httpMock = TestBed.inject(HttpTestingController);
    testContext.localizationConfig = TestBed.inject(LOCALIZATION_CONFIG);
  },
};

export const ngxIntegrationTestHelper = new TestHelper([commonTestMetaData, ngxIntegrationTestMetaData]);
