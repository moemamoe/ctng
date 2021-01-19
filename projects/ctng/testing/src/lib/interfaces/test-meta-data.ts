import { TestModuleMetadata } from '@angular/core/testing';

/**
 * The test meta data for a unit test.
 * Includes Angular TestModuleMetadata (imports/providers/declarations/etc).
 */
export interface TestMetaData extends TestModuleMetadata {
  /**
   * Callback which is triggered before each test.
   * Can be used to add custom properties to the test context.
   *
   * @param testContext The current test context of the running unit test.
   */
  beforeEach?: (testContext: any) => void;
}
