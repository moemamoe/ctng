import { Injectable, ElementRef } from '@angular/core';

@Injectable()
export class ScrollServiceMock {
  constructor() {}

  /**
   * Sets a custom element in case the scrolling does not happen on the document.
   */
  public setElement(element: ElementRef) {}

  /**
   * Trigger the service to scroll to fragment or last position depending on the scroll config.
   */
  public scroll() {}

  /**
   * Clears the Scroll Service
   */
  public clear(): void {}
}
