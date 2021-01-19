import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '@ctng/core';
import { expectNothing } from '../../lib/helper/expect-nothing';
import { ServiceTestContext } from '../../lib/interfaces/service-test-context';
import { LocalStorageMock } from '../local-storage.mock';
import { baseTestHelper, HttpServiceTestContext, httpTestHelper, TEST_TOKEN } from '../test-helper';
import { AdvancedFooService } from './advanced-foo.service';
import { FooService } from './foo.service';

/*********************************************************
 * Testing without additional config
 *********************************************************/
describe('TestHelper - Services', () => {
  // Create the test setup and context
  baseTestHelper.createServiceTestSetup(FooService);

  it('should create simple service context', function(this: ServiceTestContext<FooService>) {
    // 'Provided' by baseTestHelper
    expect(this.service).toBeDefined();
    expect(this.service.multiply(2, 3)).toBe(6);
  });

  it('should provide the common providers', function(this: ServiceTestContext<FooService>) {
    // 'Provided' by baseTestHelper
    const testToken = TestBed.inject(TEST_TOKEN);
    expect(testToken).toBeDefined();
    expect(testToken).toBe('test value');
  });
});

/*********************************************************
 * Testing with addtional config and custom context
 *********************************************************/

/**
 * For testing purpose, let's imagine we need another spy in our context for his test only,
 * we add it to our test context and set it in beforeEach().
 */
interface AdvFooServiceTestContext extends HttpServiceTestContext<AdvancedFooService> {
  spyTest: jasmine.Spy;
  testString: string;
}

describe('TestHelper - Services - additional config', () => {
  // Additional providers/imports/declarations/beforeEach for this test only
  httpTestHelper.createServiceTestSetup(AdvancedFooService, {
    providers: [{ provide: LocalStorageService, useClass: LocalStorageMock }],
    // This beforeEach is executed BEFORE the tested service was injected
    // -> Helpful for testing constructor functionality, e.g. setting up spies before
    beforeEach: (testContext: AdvFooServiceTestContext) => {
      testContext.testString = 'Value set in test-only beforeEach';
    },
  });

  // This beforeEach is executetd AFTER the tested service
  beforeEach(function(this: AdvFooServiceTestContext) {
    // Add additional properties to the test context for this test only
    this.spyTest = spyOn(this.service, 'getLocalStorageItem').and.callThrough();
  });

  it('should create service context', function(this: AdvFooServiceTestContext) {
    // 'Provided' by baseTestHelper
    expect(this.service).toBeDefined();
  });

  it('should still provide the common providers', function(this: AdvFooServiceTestContext) {
    // 'Provided' by baseTestHelper
    const testToken = TestBed.inject(TEST_TOKEN);
    expect(testToken).toBeDefined();
    expect(testToken).toBe('test value');
  });

  it('should provide mock local storage', function(this: AdvFooServiceTestContext) {
    // LocalStorageMock 'provided' by httpTestHelper.createServiceTestSetup (this test only)
    expect(this.service.getLocalStorageItem()).toBe('mock-item');
  });

  it('should set httpMock in global beforeEach()', function(this: AdvFooServiceTestContext) {
    this.service.getFoo().subscribe();

    // 'Provided' by httpTestHelper (beforeEach callback)
    this.httpMock.expectOne('/testinger');
    expectNothing();
  });

  it('should set spie in local beforeEach()', function(this: AdvFooServiceTestContext) {
    // 'Provided' by local beforeEach (this test only)
    expect(this.spyTest).toBeDefined();
  });

  it('should set test string in beforeEach() provided in service setup ', function(this: AdvFooServiceTestContext) {
    // 'Provided' by local beforeEach provided in service setup (this test only)
    expect(this.testString).toBe('Value set in test-only beforeEach');
  });
});
