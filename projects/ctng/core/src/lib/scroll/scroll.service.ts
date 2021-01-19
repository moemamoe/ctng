import { Injectable, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { LoggerService } from '../logger/logger.service';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, withLatestFrom } from 'rxjs/operators';

interface ScrollConfig {
  scrollPosition?: number;
  element?: ElementRef;
  fragment?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ScrollService {
  private lastNavEndEvent: NavigationEnd;
  private routeScrollPositions: {
    [url: string]: ScrollConfig;
  } = {};
  private renderer: Renderer2;

  constructor(private logger: LoggerService, private router: Router, private route: ActivatedRoute, rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.init();
  }

  /**
   * Sets a custom element in case the scrolling does not happen on the document.
   */
  public setElement(element: ElementRef) {
    this.routeScrollPositions[this.getCurrentUrl()].element = element;
  }

  /**
   * Trigger the service to scroll to fragment or last position depending on the scroll config.
   */
  public scroll() {
    const config = this.getCurrentScrollConfig();

    if (config.fragment) {
      this.scrollToFragment(config.fragment, config);
    } else {
      this.scrollToLastPosition(config);
    }
  }

  /**
   * Clears the Scroll Service
   */
  public clear(): void {
    this.clearScrollConfig();
  }

  /*******************************************************************
   * Private Helpers
   *******************************************************************/

  /**
   * Initializes the scroll service.
   */
  private init() {
    this.handleNavigationEvents();
  }

  /**
   * Handle all navigation events.
   */
  private handleNavigationEvents() {
    this.router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe((navStart: NavigationStart) => {
      this.finishRoute();
    });

    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        withLatestFrom(this.route.fragment),
      )
      .subscribe(([navEnd, fragment]: [NavigationEnd, string]) => {
        // We save the last nav event and create an object if it does not yet exist
        this.lastNavEndEvent = navEnd;
        if (!this.getCurrentScrollConfig()) {
          this.routeScrollPositions[this.getCurrentUrl()] = {};
          this.logDebug('Created new scroll config', this.routeScrollPositions);
        }

        if (fragment) {
          // Set the fragment
          this.getCurrentScrollConfig().fragment = fragment;
          this.logDebug('Set fragment', this.routeScrollPositions);
        }
      });
  }

  /**
   * Finishes the current route by saving the scroll position and resetting the fragment.
   */
  private finishRoute() {
    if (!this.lastNavEndEvent) {
      // There hasn't been a end event before
      return;
    }

    const scrollConfig = this.getCurrentScrollConfig();
    if (scrollConfig.element) {
      scrollConfig.scrollPosition = scrollConfig.element.nativeElement.scrollTop;
      this.logDebug('Saved scroll position of custom element', this.routeScrollPositions);
    } else {
      //  Firefox and Chrome use different settings here :(
      scrollConfig.scrollPosition = document.documentElement.scrollTop || document.body.scrollTop || 0;
      this.logDebug('Saved scroll position of document', this.routeScrollPositions);
    }

    // We reset the fragment
    scrollConfig.fragment = null;
  }

  /**
   * Get the scroll config for the current route.
   */
  private getCurrentScrollConfig() {
    return this.routeScrollPositions[this.getCurrentUrl()];
  }

  /**
   * Get the current url.
   */
  private getCurrentUrl() {
    const url = this.lastNavEndEvent.urlAfterRedirects || this.lastNavEndEvent.url;
    const [route] = url.split(/\?|\#/);
    return route;
  }

  /**
   * Scrolls to the last saved scroll position.
   */
  private scrollToLastPosition(config: ScrollConfig) {
    if (config.element) {
      config.element.nativeElement.scroll(0, config.scrollPosition);
      this.logDebug('Scrolled to last position of custom element', config);
    } else {
      //  Firefox and Chrome use different settings here :(
      this.renderer.setProperty(document.documentElement, 'scrollTop', config.scrollPosition);
      this.renderer.setProperty(document.body, 'scrollTop', config.scrollPosition);
      this.logDebug('Scrolled to last position of document', config);
    }
  }

  /**
   * Scrolls to the specified fragment element by ID.
   */
  private scrollToFragment(fragment: string, config: ScrollConfig) {
    const elSelectedById = document.querySelector(`#${fragment}`);
    if (elSelectedById) {
      this.scrollToElement(elSelectedById, config);
      return;
    }
  }

  /**
   * Scrolls to the specified element.
   */
  private scrollToElement(el: any, config: ScrollConfig): void {
    const rect = el.getBoundingClientRect();
    const left = rect.left;
    const top = rect.top;
    const offset = [0, 0];

    if (config.element) {
      config.element.nativeElement.scroll(left - offset[0], top - offset[1]);
      this.logDebug('Scrolled to anchor of custom element', config);
    } else {
      //  Firefox and Chrome use different settings here :(
      this.renderer.setProperty(document.documentElement, 'scrollTop', top - offset[1]);
      this.renderer.setProperty(document.body, 'scrollTop', top - offset[1]);
      this.logDebug('Scrolled to anchor of document', config);
    }
  }

  /**
   * Clearing the scroll configuration
   */
  private clearScrollConfig(): void {
    for (const key in this.routeScrollPositions) {
      if (this.routeScrollPositions.hasOwnProperty(key)) {
        this.routeScrollPositions[key].scrollPosition = 0;
        this.routeScrollPositions[key].element = null;
        this.routeScrollPositions[key].fragment = null;
      }
    }
  }

  /**
   * Local debug log function
   */
  private logDebug(message: string, ...input: any[]): void {
    this.logger.debug('[ScrollService]', message, ...input);
  }
}
