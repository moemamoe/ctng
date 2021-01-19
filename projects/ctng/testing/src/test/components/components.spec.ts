import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '@ctng/core';
import { expectNothing } from '../../lib/helper/expect-nothing';
import { DirectiveTestContext } from '../../lib/interfaces/directive-test-context';
import { LocalStorageMock } from '../local-storage.mock';
import { baseTestHelper, HttpDirectiveTestContext, httpTestHelper, TEST_TOKEN } from '../test-helper';
import { AdvancedFooComponent } from './advanced-foo.component';
import { FooComponent } from './foo.component';

/*********************************************************
 * Testing without additional config
 *********************************************************/

/**
 * Test host component.
 */
@Component({
  template: `
    <ct-ng-foo [fooValue]="fooValue"></ct-ng-foo>
  `,
})
class FooHostComponent {
  constructor() {}

  public fooValue: string;

  public setFooValue(value: string) {
    this.fooValue = value;
  }
}

describe('TestHelper - Components', () => {
  // Create the test setup and context
  baseTestHelper.createDirectiveTestSetup(FooComponent, FooHostComponent);

  it('should create simple component context', function(this: DirectiveTestContext<FooComponent, FooHostComponent>) {
    // 'Provided' by baseTestHelper
    expect(this.fixture).toBeDefined();
    expect(this.testedDirective).toBeDefined();
    expect(this.testedElement).toBeDefined();
    expect(this.hostComponent).toBeDefined();
    expect(this.hostElement).toBeDefined();

    this.hostComponent.setFooValue('Test Value');
    this.fixture.detectChanges();
    // Input should have been set
    expect(this.testedDirective.formattedFooValue).toEqual('TestValue');
  });

  it('should provide the common providers', function(this: DirectiveTestContext<FooComponent, FooHostComponent>) {
    // 'Provided' by baseTestHelper
    const testToken = TestBed.inject(TEST_TOKEN);
    expect(testToken).toBeDefined();
    expect(testToken).toBe('test value');
  });
});

/*********************************************************
 * Testing with additional config
 *********************************************************/

/**
 * Test wrapper component.
 */
@Component({
  template: `
    <ct-ng-adv-foo [fooValue]="fooValue"></ct-ng-adv-foo>
  `,
})
class AdvancedFooWrapperComponent {
  constructor() {}

  public fooValue: string;

  public setFooValue(value: string) {
    this.fooValue = value;
  }
}

/**
 * Just for readability, we actually do not provide additional stuff to the test context here.
 */
interface AdvancedFooTestContext extends HttpDirectiveTestContext<AdvancedFooComponent, AdvancedFooWrapperComponent> {
  testString: string;
}

describe('TestHelper - Components - additional config', () => {
  // Additional providers/imports/declarations for this test only
  httpTestHelper.createDirectiveTestSetup(AdvancedFooComponent, AdvancedFooWrapperComponent, {
    providers: [{ provide: LocalStorageService, useClass: LocalStorageMock }],
    // This beforeEach is executed BEFORE the tested service was injected
    // -> Helpful for testing constructor functionality, e.g. setting up spies before
    beforeEach: (testContext: AdvancedFooTestContext) => {
      testContext.testString = 'Value set in test-only beforeEach';
    },
  });

  it('should create component context', function(this: AdvancedFooTestContext) {
    // 'Provided' by baseTestHelper
    expect(this.fixture).toBeDefined();
    expect(this.testedDirective).toBeDefined();
    expect(this.testedElement).toBeDefined();
    expect(this.hostComponent).toBeDefined();
    expect(this.hostElement).toBeDefined();

    this.hostComponent.setFooValue('Test Value');
    this.fixture.detectChanges();
    // Input should have been set
    expect(this.testedDirective.formattedFooValue).toEqual('TestValue');
  });

  it('should provide the common providers', function(this: AdvancedFooTestContext) {
    // 'Provided' by baseTestHelper
    const testToken = TestBed.inject(TEST_TOKEN);
    expect(testToken).toBeDefined();
    expect(testToken).toBe('test value');
  });

  it('should provide mock local storage', function(this: AdvancedFooTestContext) {
    // LocalStorageMock 'provided' by httpTestHelper.createDirectiveTestSetup (this test only)
    expect(this.testedDirective.getLocalStorageItem()).toBe('mock-item');
  });

  it('should set httpMock in beforeEach()', function(this: AdvancedFooTestContext) {
    // Simulate a button click
    this.testedElement.querySelector('.foo-values').click();

    // 'Provided' by httpTestHelper (beforeEach callback)
    this.httpMock.expectOne('/foovalues');
    expectNothing();
  });

  it('should set test string in beforeEach() provided in directive setup ', function(this: AdvancedFooTestContext) {
    // 'Provided' by local beforeEach provided in directive setup (this test only)
    expect(this.testString).toBe('Value set in test-only beforeEach');
  });
});
