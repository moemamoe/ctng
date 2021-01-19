import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

function getWindow(): any {
  return window;
}

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  /**
   * Behaviour subject for app visibility change
   */
  private appVisibilityChangedSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);

  /**
   * Fires if app visibility changes.
   */
  public isAppVisible: Observable<boolean> = this.appVisibilityChangedSubject.asObservable();

  constructor() {
    this.subscribeToWindowEvents();
    this.createCrossBrowserFallbacks();
  }

  /**
   * Returns the native window
   */
  get nativeWindow(): Window {
    return getWindow();
  }

  /**
   * Opens a link
   * @param link: link as string
   */
  public open(link: string, target?: string, options?: string): void {
    this.nativeWindow.open(link, target, options);
  }

  /**
   * Sets a url to the href of the window location
   * @param href: Url to navigate
   */
  public navigate(href: string): void {
    this.nativeWindow.location.href = href;
  }

  /**
   * Subscribe to window events
   */
  private subscribeToWindowEvents(): void {
    // subscribe to visibility change and fire app visibility event
    this.nativeWindow.addEventListener('visibilitychange', () => {
      this.appVisibilityChangedSubject.next(!document.hidden);
    });
  }

  /**
   * Creates fallbacks for cross browser support
   */
  private createCrossBrowserFallbacks(): void {
    // Fallback for "requestAnimationFrame"
    if (!this.nativeWindow.requestAnimationFrame) {
      // Not available on all browsers, so we create a fallback
      this.nativeWindow.requestAnimationFrame = (function() {
        return (
          this.nativeWindow.webkitRequestAnimationFrame ||
          (this.nativeWindow as any).mozRequestAnimationFrame ||
          (this.nativeWindow as any).oRequestAnimationFrame ||
          (this.nativeWindow as any).msRequestAnimationFrame ||
          function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            this.nativeWindow.setTimeout(callback, 1000 / 60);
          }
        );
      })();
    }
  }
}
