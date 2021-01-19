import { ComponentFixture } from '@angular/core/testing';

/**
 * Generic interface for directive test contexts.
 */
export interface DirectiveTestContext<T, H> {
  fixture: ComponentFixture<H>;
  hostComponent: H;
  hostElement: any;
  testedDirective: T;
  testedElement: any;
}
