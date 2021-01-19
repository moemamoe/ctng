import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NavigationExtras, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerService } from '../../logger/logger.service';
import { loogerTestConfig } from '../../logger/loggers/test/logger-test.config';
import { ScrollService } from '../scroll.service';

@Component({
  selector: 'ct-fake-component',
  template: '',
  styles: [''],
})
class FakeComponent {}

describe('ScrollService', () => {
  // Services
  let scrollService: ScrollService;
  let router: Router;

  // spies
  let docElementTopSpy: jasmine.Spy;
  let docBodyTopSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FakeComponent],
      providers: [ScrollService, loogerTestConfig, LoggerService],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'feed', component: FakeComponent },
          { path: 'edit', component: FakeComponent },
          { path: 'dealer', component: FakeComponent },
        ]),
      ],
    });

    // services
    scrollService = TestBed.inject(ScrollService);
    router = TestBed.inject(Router);

    // spies
    docElementTopSpy = spyOnProperty(document.documentElement, 'scrollTop');
    docBodyTopSpy = spyOnProperty(document.body, 'scrollTop');
  });

  it('should be created', () => {
    expect(scrollService).toBeTruthy();
    expect(scrollService['renderer']).toBeDefined('renderer of scroll service undefined');
  });

  it('routing events should handle scroll configuration correctly (no existing scroll positions intially)', fakeAsync(() => {
    expect(scrollService['routeScrollPositions']).toEqual({}, 'Unexpected intial scoll positions');
    expect(scrollService['lastNavEndEvent']).toBeUndefined('Unexpected intial last Navigation End Event');

    // Act
    router.navigate(['/feed']);
    tick();
    expect(scrollService['lastNavEndEvent']).toBeDefined('Unexpected intial last Navigation End Event');
    expect(scrollService['lastNavEndEvent'].urlAfterRedirects).toEqual('/feed', 'Unexpected last Navigation End Event');
    expect(scrollService['routeScrollPositions']['/feed']).toEqual({});

    docElementTopSpy.and.returnValue(20);
    docBodyTopSpy.and.returnValue(undefined);

    router.navigate(['/edit']);
    tick();
    expect(scrollService['lastNavEndEvent']).toBeDefined('Unexpected intial last Navigation End Event');
    expect(scrollService['lastNavEndEvent'].urlAfterRedirects).toEqual('/edit', 'Unexpected last Navigation End Event');
    expect(scrollService['routeScrollPositions']['/edit']).toEqual({});

    docElementTopSpy.and.returnValue(undefined);
    docBodyTopSpy.and.returnValue(10);

    router.navigate(['/dealer']);
    tick();
    expect(scrollService['routeScrollPositions']['/edit'].scrollPosition).toEqual(10);
    expect(scrollService['routeScrollPositions']['/feed'].scrollPosition).toEqual(20);
  }));

  it('routing events should handle scroll configuration correctly (pre-existing scroll positions)', fakeAsync(() => {
    const expectedScrollPositions = {
      '/feed': {
        scrollPosition: 10,
        element: {
          nativeElement: {
            scrollTop: 20,
            scroll(start, end) {},
          },
        },
        fragment: 'watch-2',
      },
      '/edit': {
        scrollPosition: 50,
        element: {
          nativeElement: {
            scrollTop: 100,
            scroll(start, end) {},
          },
        },
        fragment: 'watch-4',
      },
    };

    scrollService['routeScrollPositions'] = Object.assign({}, expectedScrollPositions);

    // Act
    router.navigate(['/feed']);
    tick();
    expect(scrollService['lastNavEndEvent']).toBeDefined('Unexpected intial last Navigation End Event');
    expect(scrollService['lastNavEndEvent'].urlAfterRedirects).toEqual('/feed', 'Unexpected last Navigation End Event');

    router.navigate(['/edit']);
    tick();
    expect(scrollService['lastNavEndEvent']).toBeDefined('Unexpected intial last Navigation End Event');
    expect(scrollService['lastNavEndEvent'].urlAfterRedirects).toEqual('/edit', 'Unexpected last Navigation End Event');
    expect(scrollService['routeScrollPositions']['/edit']).toEqual(expectedScrollPositions['/edit']);

    router.navigate(['/dealer']);
    tick();
    expect(scrollService['routeScrollPositions']['/feed'].scrollPosition).toEqual(
      expectedScrollPositions['/feed'].element.nativeElement.scrollTop,
    );
    expect(scrollService['routeScrollPositions']['/feed'].scrollPosition).toEqual(
      expectedScrollPositions['/feed'].element.nativeElement.scrollTop,
    );
  }));

  it('routing events should handle scroll configuration correctly (pre-existing scroll positions)', fakeAsync(() => {
    const expectedScrollPositions = {
      '/feed': {
        scrollPosition: 10,
      },
      '/edit': {
        scrollPosition: 50,
      },
    };

    scrollService['routeScrollPositions'] = Object.assign({}, expectedScrollPositions);

    // Act
    const navExtras: NavigationExtras = {};
    navExtras.fragment = 'watch-1';
    router.navigate(['/feed'], navExtras);
    tick();
    expect(scrollService['lastNavEndEvent']).toBeDefined('Unexpected intial last Navigation End Event');
    expect(scrollService['lastNavEndEvent'].urlAfterRedirects).toEqual(
      `/feed#${navExtras.fragment}`,
      'Unexpected last Navigation End Event',
    );
    expect(scrollService['routeScrollPositions']['/feed'].fragment).toEqual(navExtras.fragment);

    navExtras.fragment = 'watch-2';
    router.navigate(['/edit'], navExtras);
    tick();
    expect(scrollService['lastNavEndEvent']).toBeDefined('Unexpected intial last Navigation End Event');
    expect(scrollService['lastNavEndEvent'].urlAfterRedirects).toEqual(
      `/edit#${navExtras.fragment}`,
      'Unexpected last Navigation End Event',
    );
    expect(scrollService['routeScrollPositions']['/edit']).toEqual(expectedScrollPositions['/edit']);
    expect(scrollService['routeScrollPositions']['/edit'].fragment).toEqual(navExtras.fragment);

    navExtras.fragment = 'watch-3';
    router.navigate(['/dealer'], navExtras);
    tick();

    expect(scrollService['routeScrollPositions']['/dealer'].fragment).toEqual(navExtras.fragment);
    expect(scrollService['routeScrollPositions']['/feed'].fragment).toBeNull();
    expect(scrollService['routeScrollPositions']['/edit'].fragment).toBeNull();
  }));

  it('scroll() should scroll to fragment, when fragment is set', fakeAsync(() => {
    const expectedScrollPositions = {
      '/feed': {
        fragment: 'watch-1',
      },
      '/edit': {
        fragment: 'watch-2',
      },
    };

    const expectedElement = {
      getBoundingClientRect() {
        return {
          top: 500,
          left: 50,
        };
      },
    };

    scrollService['routeScrollPositions'] = Object.assign({}, expectedScrollPositions);
    scrollService['lastNavEndEvent'] = {
      id: 1,
      urlAfterRedirects: '/feed',
      url: '/feed',
    };
    const docQuerySelectorSpy = spyOn(document, 'querySelector').and.returnValue(expectedElement as Element);
    const rendererSpy = spyOn(scrollService['renderer'], 'setProperty').and.callFake((element, name, value) => {
      expect(name).toEqual('scrollTop', 'Unexpected property set');
      expect(value).toEqual(expectedElement.getBoundingClientRect().top, 'Unexpected top value to property set');
    });

    // Act
    scrollService.scroll();
    tick();

    expect(docQuerySelectorSpy).toHaveBeenCalledTimes(1);
    expect(rendererSpy).toHaveBeenCalledTimes(2);
  }));

  it('scroll() should scroll to last element, when fragment is not set', fakeAsync(() => {
    const expectedScrollPositions = {
      '/feed': {
        scrollPosition: 10,
      },
      '/edit': {
        scrollPosition: 50,
      },
    };

    scrollService['routeScrollPositions'] = Object.assign({}, expectedScrollPositions);
    scrollService['lastNavEndEvent'] = {
      id: 1,
      urlAfterRedirects: '/feed',
      url: '/feed',
    };

    const rendererSpy = spyOn(scrollService['renderer'], 'setProperty').and.callFake((element, name, value) => {
      expect(name).toEqual('scrollTop', 'Unexpected property set');
      expect(value).toEqual(expectedScrollPositions['/feed'].scrollPosition, 'Unexpected top value to property set');
    });

    // Act
    scrollService.scroll();
    tick();

    // Assert
    expect(rendererSpy).toHaveBeenCalledTimes(2);
  }));

  it('scroll() should scroll to last element of the element from the config, when fragment is not set', fakeAsync(() => {
    const expectedScrollPositions = {
      '/feed': {
        scrollPosition: 10,
        element: {
          nativeElement: {
            scrollTop: 20,
            scroll(start, end) {},
          },
        },
      },
      '/edit': {
        scrollPosition: 50,
        element: {
          nativeElement: {
            scrollTop: 100,
            scroll(start, end) {},
          },
        },
      },
    };

    scrollService['routeScrollPositions'] = Object.assign({}, expectedScrollPositions);
    scrollService['lastNavEndEvent'] = {
      id: 1,
      urlAfterRedirects: '/feed',
      url: '/feed',
    };

    const rendererSpy = spyOn(scrollService['routeScrollPositions']['/feed'].element.nativeElement, 'scroll').and.callFake((left, top) => {
      expect(left).toEqual(0, 'Unexpected top value to property set');
      expect(top).toEqual(expectedScrollPositions['/feed'].scrollPosition, 'Unexpected top value to property set');
    });

    // Act
    scrollService.scroll();
    tick();

    // Assert
    expect(rendererSpy).toHaveBeenCalledTimes(1);
  }));

  it('scroll() should scroll to fragment from the config, when fragment is set', fakeAsync(() => {
    const expectedScrollPositions = {
      '/feed': {
        scrollPosition: 10,
        element: {
          nativeElement: {
            scrollTop: 20,
            scroll(start, end) {},
          },
        },
        fragment: 'watch-1',
      },
      '/edit': {
        scrollPosition: 50,
        element: {
          nativeElement: {
            scrollTop: 100,
            scroll(start, end) {},
          },
        },
        fragment: 'watch-2',
      },
    };

    scrollService['routeScrollPositions'] = Object.assign({}, expectedScrollPositions);
    scrollService['lastNavEndEvent'] = {
      id: 1,
      urlAfterRedirects: '/feed',
      url: '/feed',
    };

    const expectedElement = {
      getBoundingClientRect() {
        return {
          top: 500,
          left: 50,
        };
      },
    };

    const docQuerySelectorSpy = spyOn(document, 'querySelector').and.returnValue(expectedElement as Element);

    const rendererSpy = spyOn(scrollService['routeScrollPositions']['/feed'].element.nativeElement, 'scroll').and.callFake((left, top) => {
      expect(left).toEqual(expectedElement.getBoundingClientRect().left, 'Unexpected top value to property set');
      expect(top).toEqual(expectedElement.getBoundingClientRect().top, 'Unexpected top value to property set');
    });

    // Act
    scrollService.scroll();
    tick();

    // Assert
    expect(rendererSpy).toHaveBeenCalledTimes(1);
    expect(docQuerySelectorSpy).toHaveBeenCalledTimes(1);
  }));
});
