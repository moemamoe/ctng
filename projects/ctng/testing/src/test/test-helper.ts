import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DirectiveTestContext } from '../lib/interfaces/directive-test-context';
import { ServiceTestContext } from '../lib/interfaces/service-test-context';
import { TestMetaData } from '../lib/interfaces/test-meta-data';
import { TestHelper } from '../lib/test-helper';

/*********************************************************
 * Setup the TestHelper with some common TestMetaData.
 *
 * In this example just a simple test provider.
 *********************************************************/
export const TEST_TOKEN = new InjectionToken<string>('test-token');

const commonMetaData: TestMetaData = {
  providers: [
    {
      provide: TEST_TOKEN,
      useValue: 'test value',
    },
  ],
};

export const baseTestHelper = new TestHelper([commonMetaData]);

/*********************************************************
 * Since several TestMetaData objects can be passed to the TestHelper,
 * any number of TestHelper instances can be created including inheritance.
 *
 * e.g. if there are a lot of tests which need the http client,
 * a http (sub)TestHelper can be created. This helper then provides the
 * base TestMetaData and additional TestMetaData for http client.
 *********************************************************/

/**
 * Since all our fake http unit tests work with HttpTestingController,
 * the httpTestHelper can provide it for all tests.
 *
 * This is the base http test context interface (includes everything the httpTestHelper should provide).
 */
interface HttpTestContext {
  httpMock: HttpTestingController;
}

/**
 * The test contexts which are used in service resp. directive tests.
 */
export interface HttpServiceTestContext<T> extends ServiceTestContext<T>, HttpTestContext {}
export interface HttpDirectiveTestContext<T, H> extends DirectiveTestContext<T, H>, HttpTestContext {}

export const httpTestHelper = new TestHelper([
  // http helper uses the everything from base helper
  ...baseTestHelper.getCommonTestMetaData(),
  {
    imports: [HttpClientTestingModule],
    beforeEach: (testContext: HttpTestContext) => {
      // Callback which is used before each test, here the HttpTestingController is set on the test context
      testContext.httpMock = TestBed.inject(HttpTestingController);
    },
  },
]);
