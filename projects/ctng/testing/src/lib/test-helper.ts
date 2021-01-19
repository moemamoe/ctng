import { Type } from '@angular/core';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { ServiceTestContext } from './interfaces/service-test-context';
import { DirectiveTestContext } from './interfaces/directive-test-context';
import { By } from '@angular/platform-browser';
import { TestMetaData } from './interfaces/test-meta-data';

/**
 * Test helper class which creates test setups.
 */
export class TestHelper {
  /**
   * Creates an instance of the TestHelper with n common meta data definitions.
   * All common providers, imports and declarations are merged into the test setup automatically.
   *
   * @param commonTestMetaData: Common test meta data definitions.
   */
  constructor(private readonly commonTestMetaData: TestMetaData[] = []) {
    if (!commonTestMetaData) {
      commonTestMetaData = [];
    }
  }

  /**
   * Gets the common meta data definitions.
   */
  public getCommonTestMetaData(): TestMetaData[] {
    return this.commonTestMetaData;
  }

  /**
   * Generic setup for service tests.
   * Merges all common TestMetaData and the locally provided TestMetaData and configures the TestingModule.
   *
   * Additionally sets global spies and calls beforeEach of common and local TestMetaData (before testedService is injected).
   */
  public createServiceTestSetup<T>(testedService: Type<T>, testMetaData?: TestMetaData): void {
    const mergedModuleDef = this.getMergedModuleDef(testMetaData);

    // Add the service to test to merged module def
    this.mergeModuleDefType(mergedModuleDef, [testedService], 'providers');

    const testHelperContext = this;

    beforeEach(function(this: ServiceTestContext<T>) {
      TestBed.configureTestingModule(mergedModuleDef);

      // Set spies
      testHelperContext.setGlobalSpies();

      // Call beforeEachs
      testHelperContext.callBeforeEachs(testMetaData, this);

      // Set the service
      this.service = TestBed.inject(testedService);
    });
  }

  /**
   * Generic setup for directive tests.
   * Merges all common TestMetaData and the locally provided TestMetaData and configures the TestingModule.
   *
   * Additionally sets global spies and calls beforeEach of common and local TestMetaData (before directive is created).
   */
  createDirectiveTestSetup<T, H>(testedType: Type<T>, hostType: Type<H>, testMetaData?: TestMetaData): void {
    const mergedModuleDef = this.getMergedModuleDef(testMetaData);

    // Add the directives to test to merged module def
    this.mergeModuleDefType(mergedModuleDef, [testedType, hostType], 'declarations');

    const testHelperContext = this;

    beforeEach(function(this: DirectiveTestContext<T, H>) {
      TestBed.configureTestingModule(mergedModuleDef);

      // Set spies
      testHelperContext.setGlobalSpies();

      // Call beforeEachs
      testHelperContext.callBeforeEachs(testMetaData, this);

      this.fixture = TestBed.createComponent(hostType);
      this.fixture.detectChanges();
      this.hostComponent = this.fixture.componentInstance;
      this.hostElement = this.fixture.nativeElement;
      const testedDebugElement = this.fixture.debugElement.query(By.directive(testedType));
      this.testedDirective = testedDebugElement.injector.get(testedType);
      this.testedElement = testedDebugElement.nativeElement;
    });

    afterEach(function(this: DirectiveTestContext<T, H>) {
      if (this.fixture) {
        this.fixture.destroy();
      }
    });
  }

  /**
   * Calls beforeEach callback of all common TestMetaData and of local provided one if available.
   */
  private callBeforeEachs(localTestMetaData: TestMetaData, testContext: any) {
    // All common beforeEachs
    for (const data of this.commonTestMetaData) {
      this.callBeforeEach(data, testContext);
    }

    // The local provided beforeEach
    this.callBeforeEach(localTestMetaData, testContext);
  }

  /**
   * Sets common global spies.
   */
  private setGlobalSpies() {
    // We always fake setTimeouts
    (spyOn(window, 'setTimeout') as jasmine.Spy).and.callFake((callback: (...args: any[]) => void, ms: number, ...args: any[]) => {
      callback();
    });
  }

  /**
   * Calls the beforeEach function of the specified testMetaData if available.
   */
  private callBeforeEach(testMetaData: TestMetaData, testContext: any) {
    if (testMetaData && testMetaData.beforeEach && typeof testMetaData.beforeEach === 'function') {
      testMetaData.beforeEach(testContext);
    }
  }

  /**
   * Gets the merged module definition. Merges all common module defs and the provided module def.
   * @param moduleDef The module def to merge with common ones.
   */
  private getMergedModuleDef(moduleDef?: TestModuleMetadata): TestModuleMetadata {
    const mergedModuleDef: TestModuleMetadata = {};

    // Merge the common module defitions
    for (const mDef of this.commonTestMetaData) {
      this.mergeModuleDef(mergedModuleDef, mDef);
    }

    if (moduleDef) {
      // Merge the function level provided module def
      this.mergeModuleDef(mergedModuleDef, moduleDef);
    }

    return mergedModuleDef;
  }

  /**
   * Merges two module definitions.
   * @param baseModuleDef The base module def which is merged to.
   * @param moduleDefToMerge The new module definition which is merged to base.
   */
  private mergeModuleDef(baseModuleDef: TestModuleMetadata, moduleDefToMerge: TestModuleMetadata) {
    this.mergeModuleDefType(baseModuleDef, moduleDefToMerge.imports, 'imports');
    this.mergeModuleDefType(baseModuleDef, moduleDefToMerge.providers, 'providers');
    this.mergeModuleDefType(baseModuleDef, moduleDefToMerge.declarations, 'declarations');
  }

  /**
   * Merges the module definitions providers, imports or declarations with additional data.
   * @param moduleDef The test module meta data definition.
   * @param data The providers/declarations/imports to merge.
   * @param type String which type has to be merged.
   */
  private mergeModuleDefType(moduleDef: TestModuleMetadata, data: any[], type: 'providers' | 'imports' | 'declarations') {
    if (!data || data.length < 1) {
      // Noting to merge
      return;
    }

    if (!moduleDef[type]) {
      moduleDef[type] = [];
    }

    moduleDef[type] = moduleDef[type].concat(data);
  }
}
