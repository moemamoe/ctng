# TestHelper

The TestHelper helps sharing code between Angular & Jasmine unit tests by providing common test setups and corresponding test contexts for services and directives.

How does it work: The idea of this library is based on Jasmine's `userContext` which is an empty object that is set as the receiver for each test (and their `beforeEach` / `afterEach`), thus it can be used and edit via `this` during tests and test setups. See [this gist for more information](https://gist.github.com/traviskaufman/11131303).

**Note**: Since the concept relies on `userContext` and so on `this` within unit tests, `function(this: ***) {}` has to be used within `beforeEach()`, `afterEach()` and `it()`. By using arrow functions (`() => {}`) the `userContext` can't be accessed.

## How to use

In the following section parts of the unit tests for this library are shown to demonstrate how to use the TestHelper.
For a more detailed look, see `/test/*.spec.ts`.

## TestHelper Setup

You can create a new instance of the TestHelper globally by passing one or several common `TestMetaData` definition(s) - including Angular `TestModuleMetadata` (imports/providers/declarations/etc).

```ts
// src/test/test-helper.ts#L9-L62

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
```

## TestHelper functions

A configured test helper instance provides

- `createServiceTestSetup(FooService)` for services
- `createDirectiveTestSetup(FooComponent, FooHostComponent)` for directives

Additionally you can pass further `TestMetaData` into the calls which are only provided in the particular `describe()` context.

**Note:** If the passed `TestMetaData` contains a `beforeEach()` function, this function is called **before** the tested service/directive is injected. Can be used e.g. to spie on functions the constructor of the tested service is calling. If the service instance is needed, a `beforeEach()` can be placed within `describe()` as usual (is called **after** injection).

## Testing Services

Run `testHelper.createServiceTestSetup` within `describe()` and provide the service you want to test. The `ServiceTestContext<T>` interface gives typing and intellisense to your test context.

### Without additional config

```ts
// src/test/services/services.spec.ts#L13-L29

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
```

### With additional config

```ts
// src/test/services/services.spec.ts#L35-L95

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
    // 'Provided' by local beforeEach (this test only)
    expect(this.testString).toBe('Value set in test-only beforeEach');
  });
});
```

## Testing Directives (components, attribute directives, etc.)

The TestHelper implements the 'Host Component principle' (see [Angular docs](https://angular.io/guide/testing#component-inside-a-test-host)). That means a directive is tested by creating a test host component which uses the actual directive to test.

Run `testHelper.createDirectiveTestSetup` and provide the directive to test and the test host component. The `DirectiveTestContext<T, H>` automatically gives intellisense to your test context.

### Without additional config

```ts
// src/test/components/components.spec.ts#L15-L57

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
```

### With additional config

```ts
// src/test/components/components.spec.ts#L63-L138

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
```
